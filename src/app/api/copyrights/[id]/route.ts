import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, writeLog } from "@/lib/audit";

const copyrightFieldLabels = {
  name: "软著名称",
  registrationNumber: "登记号",
  version: "版本",
  registrationDate: "登记日期",
};

// GET /api/copyrights/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const copyright = await prisma.softwareCopyright.findUnique({ where: { id } });

    if (!copyright) {
      return NextResponse.json({ error: "软著不存在" }, { status: 404 });
    }

    return NextResponse.json(copyright);
  } catch (error) {
    console.error("Error fetching copyright:", error);
    return NextResponse.json({ error: "获取软著失败" }, { status: 500 });
  }
}

// PUT /api/copyrights/[id]
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
    const { name, registrationNumber, version, registrationDate } = body;

    const before = await prisma.softwareCopyright.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "软著不存在" }, { status: 404 });
    }

    const copyright = await prisma.softwareCopyright.update({
      where: { id },
      data: {
        name,
        registrationNumber,
        version,
        registrationDate: registrationDate ? new Date(registrationDate) : null,
      },
    });

    const changes = diffRecord(before, copyright, copyrightFieldLabels);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "copyright",
        targetId: copyright.id,
        targetLabel: copyright.name,
        summary: describeLog("UPDATE", "copyright", copyright.name),
        changes,
      });
    }

    return NextResponse.json(copyright);
  } catch (error) {
    console.error("Error updating copyright:", error);
    return NextResponse.json({ error: "更新软著失败" }, { status: 500 });
  }
}

// DELETE /api/copyrights/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.softwareCopyright.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "软著不存在" }, { status: 404 });
    }

    await prisma.softwareCopyright.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "copyright",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "copyright", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting copyright:", error);
    return NextResponse.json({ error: "删除软著失败" }, { status: 500 });
  }
}
