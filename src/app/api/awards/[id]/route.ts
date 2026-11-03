import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toAwardCategory } from "@/lib/award-category";

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
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, competition, category, winners, year, description, imageUrl } = body;

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
  try {
    const { id } = await params;
    await prisma.award.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json({ error: "删除获奖记录失败" }, { status: 500 });
  }
}
