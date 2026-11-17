import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/api-auth";
import { writeLog } from "@/lib/audit";
import { isLogAction, isModuleKey } from "@/lib/audit-meta";
import {
  clampPage,
  getTotalPages,
  parsePagination,
  toPageResult,
} from "@/lib/pagination";

/** 解析 YYYY-MM-DD；endOfDay 为 true 时取当天 23:59:59.999（用于「截至某日」）。 */
function parseDateBoundary(value: string | null, endOfDay: boolean): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;

  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0
  );

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 出现过操作记录的操作人，供筛选下拉使用（含已被删除用户的快照名）。 */
async function getOperators() {
  const grouped = await prisma.operationLog.groupBy({
    by: ["userId"],
    where: { userId: { not: null } },
    _count: true,
  });

  const ids = grouped
    .map((row) => row.userId)
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  const nameById = new Map(users.map((user) => [user.id, user.name]));

  // 用户已被删除时，用日志里保存的姓名快照兜底
  const missingIds = ids.filter((id) => !nameById.has(id));
  if (missingIds.length > 0) {
    const snapshots = await prisma.operationLog.findMany({
      where: { userId: { in: missingIds } },
      distinct: ["userId"],
      select: { userId: true, userName: true },
    });
    for (const snapshot of snapshots) {
      if (!snapshot.userId) continue;
      nameById.set(
        snapshot.userId,
        snapshot.userName ? `${snapshot.userName}（已删除）` : "已删除用户"
      );
    }
  }

  return grouped
    .filter((row) => row.userId)
    .map((row) => ({
      id: row.userId as string,
      name: nameById.get(row.userId as string) ?? "未知用户",
      count: row._count,
    }))
    .sort((a, b) => b.count - a.count);
}

// GET /api/logs - 操作日志列表（仅超级管理员）
export async function GET(request: Request) {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams);
    const q = searchParams.get("q")?.trim() ?? "";
    const moduleParam = searchParams.get("module") ?? "";
    const actionParam = searchParams.get("action") ?? "";
    const userId = searchParams.get("userId") ?? "";
    const from = parseDateBoundary(searchParams.get("from"), false);
    const to = parseDateBoundary(searchParams.get("to"), true);

    const where: Prisma.OperationLogWhereInput = {};
    if (moduleParam && isModuleKey(moduleParam)) where.module = moduleParam;
    if (actionParam && isLogAction(actionParam)) where.action = actionParam;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }
    if (q) {
      where.OR = [
        { summary: { contains: q } },
        { targetLabel: { contains: q } },
        { userName: { contains: q } },
        { userEmail: { contains: q } },
      ];
    }

    const total = await prisma.operationLog.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);

    // 按日期倒序；同一毫秒内用 id 兜底，保证分页顺序稳定
    const items = await prisma.operationLog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json({
      ...toPageResult(items, total, page, pagination.pageSize),
      operators: await getOperators(),
    });
  } catch (error) {
    console.error("Error fetching operation logs:", error);
    return NextResponse.json({ error: "获取操作日志失败" }, { status: 500 });
  }
}

// DELETE /api/logs - 手动清理指定日期之前的日志（仅超级管理员）
export async function DELETE(request: Request) {
  const guard = await requireSuperAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json().catch(() => ({}));
    const before = parseDateBoundary(
      typeof body?.before === "string" ? body.before : null,
      false
    );

    if (!before) {
      return NextResponse.json(
        { error: "请提供清理截止日期（格式 YYYY-MM-DD）" },
        { status: 400 }
      );
    }

    const result = await prisma.operationLog.deleteMany({
      where: { createdAt: { lt: before } },
    });

    // 清理行为本身也要留痕，方便日后回溯
    if (result.count > 0) {
      const boundary = formatDate(before);
      await writeLog({
        request,
        actor: guard.user,
        action: "DELETE",
        module: "log",
        targetLabel: `${boundary} 之前的日志`,
        summary: `清理操作日志：删除 ${boundary} 之前的记录，共 ${result.count} 条`,
        detail: `deleted=${result.count}`,
      });
    }

    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error("Error cleaning operation logs:", error);
    return NextResponse.json({ error: "清理操作日志失败" }, { status: 500 });
  }
}
