import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampPage,
  getTotalPages,
  getYearRange,
  parsePagination,
  parseYear,
  toPageResult,
} from "@/lib/pagination";

async function getYears(): Promise<number[]> {
  const rows = await prisma.patent.findMany({
    select: { applicationDate: true, authorizationDate: true },
  });
  const years = new Set<number>();
  for (const row of rows) {
    const date = row.authorizationDate ?? row.applicationDate;
    if (date) years.add(date.getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

// GET /api/patents - 获取专利列表（支持分页、搜索、年份筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const year = parseYear(searchParams.get("year"));

    const conditions: Prisma.PatentWhereInput[] = [];
    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search } },
          { inventors: { contains: search } },
        ],
      });
    }
    if (year) {
      const { start, end } = getYearRange(year);
      conditions.push({
        OR: [
          { authorizationDate: { gte: start, lt: end } },
          { authorizationDate: null, applicationDate: { gte: start, lt: end } },
        ],
      });
    }
    const where: Prisma.PatentWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};
    const orderBy: Prisma.PatentOrderByWithRelationInput = { createdAt: "desc" };

    if (!pagination.paginated) {
      const patents = await prisma.patent.findMany({ where, orderBy });
      return NextResponse.json(patents);
    }

    const total = await prisma.patent.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const patents = await prisma.patent.findMany({
      where,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(
      toPageResult(patents, total, page, pagination.pageSize, await getYears())
    );
  } catch (error) {
    console.error("Error fetching patents:", error);
    return NextResponse.json({ error: "获取专利失败" }, { status: 500 });
  }
}

// POST /api/patents
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, patentNumber, patentType, status, applicationDate, authorizationDate, inventors } = body;

    const patent = await prisma.patent.create({
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

    return NextResponse.json(patent, { status: 201 });
  } catch (error) {
    console.error("Error creating patent:", error);
    return NextResponse.json({ error: "创建专利失败" }, { status: 500 });
  }
}
