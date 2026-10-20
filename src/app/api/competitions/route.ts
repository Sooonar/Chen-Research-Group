import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { clampPage, getTotalPages, parsePagination, toPageResult } from "@/lib/pagination";

const competitionResults = ["WON", "NOT_WON"] as const;
type CompetitionResultValue = (typeof competitionResults)[number];

const include = {
  project: { select: { id: true, name: true } },
  award: { select: { id: true, name: true, level: true } },
} satisfies Prisma.CompetitionInclude;

const orderBy: Prisma.CompetitionOrderByWithRelationInput[] = [
  { year: "desc" },
  { createdAt: "desc" },
];

// GET /api/competitions - 获取竞赛记录（支持分页与结果筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const resultParam = searchParams.get("result");
    const result = competitionResults.includes(resultParam as CompetitionResultValue)
      ? (resultParam as CompetitionResultValue)
      : undefined;

    const where: Prisma.CompetitionWhereInput = result ? { result } : {};

    if (!pagination.paginated) {
      const competitions = await prisma.competition.findMany({ where, include, orderBy });
      return NextResponse.json(competitions);
    }

    const total = await prisma.competition.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const competitions = await prisma.competition.findMany({
      where,
      include,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(
      toPageResult(competitions, total, page, pagination.pageSize)
    );
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json({ error: "获取竞赛记录失败" }, { status: 500 });
  }
}

// POST /api/competitions
export async function POST(request: Request) {
  try {
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
      let awardId: string | null = null;

      if (result === "WON") {
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

        if (projectId) {
          await tx.projectAward.create({
            data: { projectId, awardId: award.id },
          });
        }
      }

      return tx.competition.create({
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

    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error("Error creating competition:", error);
    return NextResponse.json({ error: "创建竞赛记录失败" }, { status: 500 });
  }
}
