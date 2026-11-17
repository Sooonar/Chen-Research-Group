import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, writeLog } from "@/lib/audit";

const algorithmFieldLabels = {
  name: "名称",
  description: "简介",
  useCases: "应用场景",
  readmeContent: "说明文档",
};

// GET /api/algorithms/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const algorithm = await prisma.algorithm.findUnique({ where: { id } });

    if (!algorithm) {
      return NextResponse.json({ error: "算法不存在" }, { status: 404 });
    }

    return NextResponse.json(algorithm);
  } catch (error) {
    console.error("Error fetching algorithm:", error);
    return NextResponse.json({ error: "获取算法失败" }, { status: 500 });
  }
}

// PUT /api/algorithms/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, useCases, readmeContent } = body;

    const before = await prisma.algorithm.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "算法不存在" }, { status: 404 });
    }

    const algorithm = await prisma.algorithm.update({
      where: { id },
      data: {
        name,
        description,
        useCases,
        readmeContent,
      },
    });

    const changes = diffRecord(before, algorithm, algorithmFieldLabels);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "algorithm",
        targetId: algorithm.id,
        targetLabel: algorithm.name,
        summary: describeLog("UPDATE", "algorithm", algorithm.name),
        changes,
      });
    }

    return NextResponse.json(algorithm);
  } catch (error) {
    console.error("Error updating algorithm:", error);
    return NextResponse.json({ error: "更新算法失败" }, { status: 500 });
  }
}

// DELETE /api/algorithms/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.algorithm.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "算法不存在" }, { status: 404 });
    }

    await prisma.algorithm.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "algorithm",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "algorithm", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting algorithm:", error);
    return NextResponse.json({ error: "删除算法失败" }, { status: 500 });
  }
}
