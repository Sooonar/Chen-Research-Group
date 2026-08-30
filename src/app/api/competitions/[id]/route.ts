import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const competitionResults = ["WON", "NOT_WON"] as const;

// GET /api/competitions/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        award: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: "竞赛记录不存在" }, { status: 404 });
    }

    return NextResponse.json(competition);
  } catch (error) {
    console.error("Error fetching competition:", error);
    return NextResponse.json({ error: "获取竞赛记录失败" }, { status: 500 });
  }
}

// PUT /api/competitions/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      organizer,
      year,
      result,
      participants,
      awardLevel,
      description,
      imageUrl,
      projectId,
    } = body;

    if (!name || !organizer || !participants || !competitionResults.includes(result)) {
      return NextResponse.json({ error: "请填写完整的竞赛信息" }, { status: 400 });
    }

    const competition = await prisma.$transaction(async (tx) => {
      const existing = await tx.competition.findUnique({
        where: { id },
        include: { award: true },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      let awardId = existing.awardId;
      if (result === "WON") {
        if (existing.awardId) {
          await tx.award.update({
            where: { id: existing.awardId },
            data: {
              name,
              competition: organizer,
              level: awardLevel || "OTHER",
              winners: participants,
              year: parseInt(year, 10),
              description: description || null,
              imageUrl: imageUrl || null,
            },
          });
        } else {
          const award = await tx.award.create({
            data: {
              name,
              competition: organizer,
              level: awardLevel || "OTHER",
              winners: participants,
              year: parseInt(year, 10),
              description: description || null,
              imageUrl: imageUrl || null,
            },
          });
          awardId = award.id;
        }
      } else if (existing.awardId) {
        await tx.award.delete({ where: { id: existing.awardId } });
        awardId = null;
      }

      if (existing.awardId && existing.projectId !== projectId) {
        await tx.projectAward.deleteMany({
          where: { projectId: existing.projectId || undefined, awardId: existing.awardId },
        });
      }

      if (result === "WON" && awardId && projectId) {
        await tx.projectAward.upsert({
          where: { projectId_awardId: { projectId, awardId } },
          update: {},
          create: { projectId, awardId },
        });
      }

      return tx.competition.update({
        where: { id },
        data: {
          name,
          organizer,
          year: parseInt(year, 10),
          result,
          participants,
          awardLevel: result === "WON" ? awardLevel || "OTHER" : null,
          description: description || null,
          imageUrl: imageUrl || null,
          projectId: projectId || null,
          awardId,
        },
        include: {
          project: { select: { id: true, name: true } },
          award: { select: { id: true, name: true, level: true } },
        },
      });
    });

    return NextResponse.json(competition);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "竞赛记录不存在" }, { status: 404 });
    }
    console.error("Error updating competition:", error);
    return NextResponse.json({ error: "更新竞赛记录失败" }, { status: 500 });
  }
}

// DELETE /api/competitions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.$transaction(async (tx) => {
      const competition = await tx.competition.findUnique({
        where: { id },
        select: { awardId: true },
      });

      if (!competition) {
        throw new Error("NOT_FOUND");
      }

      await tx.competition.delete({ where: { id } });
      if (competition.awardId) {
        await tx.award.delete({ where: { id: competition.awardId } });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "竞赛记录不存在" }, { status: 404 });
    }
    console.error("Error deleting competition:", error);
    return NextResponse.json({ error: "删除竞赛记录失败" }, { status: 500 });
  }
}
