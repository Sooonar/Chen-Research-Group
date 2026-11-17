import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/api-auth";
import {
  ACTION_LABELS,
  MODULE_LABELS,
  type FieldChange,
  type LogAction,
  type ModuleKey,
} from "@/lib/audit-meta";

/** 单个字段值在日志里的最大长度，避免正文类字段把日志表撑大。 */
const MAX_VALUE_LENGTH = 200;

interface WriteLogParams {
  request: Request;
  /** 操作人；匿名接口（如注册）传入被创建的用户信息即可。 */
  actor: SessionUser | null;
  action: LogAction;
  module: ModuleKey;
  targetId?: string | null;
  targetLabel?: string | null;
  summary: string;
  changes?: FieldChange[];
  detail?: string | null;
}

/**
 * 写入一条操作日志。
 *
 * 刻意做成「只记录、不抛错」：日志失败不能影响业务请求本身，
 * 代价是极端情况下会漏记录，通过 console.error 留痕便于排查。
 */
export async function writeLog({
  request,
  actor,
  action,
  module,
  targetId,
  targetLabel,
  summary,
  changes,
  detail,
}: WriteLogParams): Promise<void> {
  try {
    await prisma.operationLog.create({
      data: {
        userId: actor?.id ?? null,
        userName: actor?.name ?? null,
        userEmail: actor?.email ?? null,
        userRole: actor?.role ?? null,
        action,
        module,
        targetId: targetId ?? null,
        targetLabel: targetLabel ? truncate(targetLabel) : null,
        summary,
        changes: changes && changes.length > 0 ? JSON.stringify(changes) : null,
        detail: detail ?? null,
        ip: getClientIp(request),
        userAgent: truncate(request.headers.get("user-agent") ?? "", 500) || null,
      },
    });
  } catch (error) {
    console.error("[audit] 写入操作日志失败:", error);
  }
}

/** 统一的中文描述：新增论文「xxx」 / 删除科研项目「xxx」。 */
export function describeLog(
  action: LogAction,
  module: ModuleKey,
  label?: string | null
): string {
  const object = label ? `${MODULE_LABELS[module]}「${label}」` : MODULE_LABELS[module];
  return `${ACTION_LABELS[action]}${object}`;
}

/**
 * 对比更新前后的记录，产出字段级变更。
 * `labels` 同时决定了「哪些字段需要记录」以及它们的中文名；
 * 枚举字段可通过 `formatters` 转成中文再比较。
 */
export function diffRecord(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
  labels: Record<string, string>,
  formatters: Record<string, (value: unknown) => string> = {}
): FieldChange[] {
  if (!after) return [];

  const format = (field: string, value: unknown) =>
    formatters[field] ? formatters[field](value) : formatLogValue(value);

  const changes: FieldChange[] = [];
  for (const [field, label] of Object.entries(labels)) {
    if (!(field in after)) continue;
    const beforeValue = format(field, before?.[field]);
    const afterValue = format(field, after[field]);
    if (beforeValue !== afterValue) {
      changes.push({ field, label, before: beforeValue, after: afterValue });
    }
  }
  return changes;
}

/** 把任意字段值转成便于阅读的文本（空值统一为空串）。 */
export function formatLogValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return formatDate(value);
  if (typeof value === "boolean") return value ? "是" : "否";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return truncate(value.trim());
  if (Array.isArray(value)) return truncate(value.map(formatLogValue).join("、"));
  try {
    return truncate(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

/** 枚举值转中文，用于日志的可读展示。 */
export function labelOf(
  map: Record<string, string>,
  value: unknown
): string {
  if (typeof value !== "string") return formatLogValue(value);
  return map[value] ?? value;
}

function formatDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function truncate(value: string, max = MAX_VALUE_LENGTH): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return request.headers.get("x-real-ip") ?? null;
}
