import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, labelOf, writeLog } from "@/lib/audit";
import { patentStatusLabels, patentTypeLabels } from "@/lib/log-labels";

const patentFieldLabels = {
  name: "专利名称",
  patentNumber: "专利号",
  patentType: "专利类型",
  status: "状态",
  applicationDate: "申请日期",
  authorizationDate: "授权日期",
  inventors: "发明人",
};

const patentFormatters = {
  patentType: (value: unknown) => labelOf(patentTypeLabels, value),
  status: (value: unknown) => labelOf(patentStatusLabels, value),
};

// GET /api/patents/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patent = await prisma.patent.findUnique({ where: { id } });

    if (!patent) {
      return NextResponse.json({ error: "专利不存在" }, { status: 404 });
    }

    return NextResponse.json(patent);
  } catch (error) {
    console.error("Error fetching patent:", error);
    return NextResponse.json({ error: "获取专利失败" }, { status: 500 });
  }
}

// PUT /api/patents/[id]
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
    const { name, patentNumber, patentType, status, applicationDate, authorizationDate, inventors } = body;

    const before = await prisma.patent.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "专利不存在" }, { status: 404 });
    }

    const patent = await prisma.patent.update({
      where: { id },
      data: {
        name,
        patentNumber,
        patentType,
        status,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        authorizationDate: authorizationDate ? new Date(authorizationDate) : null,
        inventors,
      },
    });

    const changes = diffRecord(before, patent, patentFieldLabels, patentFormatters);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "patent",
        targetId: patent.id,
        targetLabel: patent.name,
        summary: describeLog("UPDATE", "patent", patent.name),
        changes,
      });
    }

    return NextResponse.json(patent);
  } catch (error) {
    console.error("Error updating patent:", error);
    return NextResponse.json({ error: "更新专利失败" }, { status: 500 });
  }
}

// DELETE /api/patents/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.patent.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "专利不存在" }, { status: 404 });
    }

    await prisma.patent.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "patent",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "patent", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patent:", error);
    return NextResponse.json({ error: "删除专利失败" }, { status: 500 });
  }
}
