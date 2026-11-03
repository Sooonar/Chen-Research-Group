import { NextResponse } from "next/server";
import type { Award, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { toAwardCategory } from "@/lib/award-category";
import {
  clampPage,
  getTotalPages,
  parsePagination,
  parseYear,
  toPageResult,
} from "@/lib/pagination";

const orderBy: Prisma.AwardOrderByWithRelationInput[] = [
  { year: "desc" },
  { createdAt: "desc" },
];

/** 去掉姓名里的括号备注、空格和“老师”后缀，与前台展示逻辑保持一致。 */
function normalizeName(value: string): string {
  return value
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/\s+/g, "")
    .replace(/老师$/, "");
}

/** 判断获奖成员里是否包含至少一位在册同学。 */
function hasClassmateWinner(winners: string, studentNames: string[]): boolean {
  const winnerNames = winners
    .split(/[,，、]/)
    .map((name) => normalizeName(name.trim()))
    .filter(Boolean);

  return winnerNames.some((winner) =>
    studentNames.some(
      (student) =>
        winner === student || winner.includes(student) || student.includes(winner)
    )
  );
}

async function getYears(): Promise<number[]> {
  const rows = await prisma.award.groupBy({ by: ["year"], _count: true });
  return rows.map((row) => row.year).sort((a, b) => b - a);
}

// GET /api/awards - 获取获奖记录（支持分页、搜索、年份与范围筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const year = parseYear(searchParams.get("year"));
    const scope = searchParams.get("scope");
    const category = searchParams.get("category");

    const conditions: Prisma.AwardWhereInput[] = [];
    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search } },
          { competition: { contains: search } },
          { winners: { contains: search } },
        ],
      });
    }
    if (year) conditions.push({ year });
    if (category) conditions.push({ category: toAwardCategory(category) });

    // “我的”范围：只返回当前登录用户提交或参与的获奖。
    if (scope === "mine") {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      if (!email) {
        return NextResponse.json(
          pagination.paginated
            ? toPageResult<Award>([], 0, 1, pagination.pageSize, await getYears())
            : []
        );
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true },
      });
      if (!user) {
        return NextResponse.json(
          pagination.paginated
            ? toPageResult<Award>([], 0, 1, pagination.pageSize, await getYears())
            : []
        );
      }

      conditions.push({
        OR: [
          { submittedBy: user.id },
          { winners: { contains: user.name } },
        ],
      });
    }

    const where: Prisma.AwardWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    if (!pagination.paginated) {
      const awards = await prisma.award.findMany({ where, orderBy });
      return NextResponse.json(awards);
    }

    const years = await getYears();

    // “同学”范围需要把获奖成员与在册同学姓名做归一化比对，先筛出命中的 ID 再分页取记录。
    if (scope === "classmates") {
      const students = await prisma.member.findMany({
        where: { title: { not: "TEACHER" } },
        select: { name: true },
      });
      const studentNames = students
        .map((student) => normalizeName(student.name))
        .filter(Boolean);

      const candidates = await prisma.award.findMany({
        where,
        orderBy,
        select: { id: true, winners: true, submittedBy: true },
      });
      const matchedIds = candidates
        .filter(
          (award) =>
            !award.submittedBy ||
            hasClassmateWinner(award.winners, studentNames)
        )
        .map((award) => award.id);

      const total = matchedIds.length;
      const totalPages = getTotalPages(total, pagination.pageSize);
      const page = clampPage(pagination.page, totalPages);
      const pageIds = matchedIds.slice(
        (page - 1) * pagination.pageSize,
        page * pagination.pageSize
      );

      const rows =
        pageIds.length > 0
          ? await prisma.award.findMany({ where: { id: { in: pageIds } } })
          : [];
      const rowsById = new Map(rows.map((award) => [award.id, award]));
      const items = pageIds
        .map((id) => rowsById.get(id))
        .filter((award): award is Award => Boolean(award));

      return NextResponse.json(
        toPageResult(items, total, page, pagination.pageSize, years)
      );
    }

    const total = await prisma.award.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const awards = await prisma.award.findMany({
      where,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(
      toPageResult(awards, total, page, pagination.pageSize, years)
    );
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json({ error: "获取获奖记录失败" }, { status: 500 });
  }
}

// POST /api/awards
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, competition, category, winners, year, description, imageUrl } = body;

    const award = await prisma.award.create({
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

    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json({ error: "创建获奖记录失败" }, { status: 500 });
  }
}
