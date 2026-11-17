import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAwardCategory } from "@/lib/award-category";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, labelOf, writeLog } from "@/lib/audit";
import { awardCategoryLabels } from "@/lib/log-labels";

const awardFieldLabels = {
  name: "获奖名称",
  competition: "赛事/评奖机构",
  category: "获奖分类",
  winners: "获奖成员",
  year: "年份",
  description: "简介",
};

const awardFormatters = {
  category: (value: unknown) => labelOf(awardCategoryLabels, value),
};

// GET /api/awards/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const award = await prisma.award.findUnique({ where: { id } });

    if (!award) {
      return NextResponse.json({ error: "获奖记录不存在" }, { status: 404 });
    }

    return NextResponse.json(award);
  } catch (error) {
    console.error("Error fetching award:", error);
    return NextResponse.json({ error: "获取获奖记录失败" }, { status: 500 });
  }
}

// PUT /api/awards/[id]
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
    const { name, competition, category, winners, year, description, imageUrl } = body;

    const before = await prisma.award.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "获奖记录不存在" }, { status: 404 });
    }

    const award = await prisma.award.update({
      where: { id },
      data: {
        name,
        competition,
        category: toAwardCategory(category),
        winners,
        year: parseInt(year),
        description,
        imageUrl,
      },
    });

    const changes = diffRecord(before, award, awardFieldLabels, awardFormatters);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "award",
        targetId: award.id,
        targetLabel: award.name,
        summary: describeLog("UPDATE", "award", award.name),
        changes,
      });
    }

    return NextResponse.json(award);
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json({ error: "更新获奖记录失败" }, { status: 500 });
  }
}

// DELETE /api/awards/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.award.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "获奖记录不存在" }, { status: 404 });
    }

    await prisma.award.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "award",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "award", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json({ error: "删除获奖记录失败" }, { status: 500 });
  }
}
