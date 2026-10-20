import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampPage,
  getTotalPages,
  parsePagination,
  parseYear,
  toPageResult,
} from "@/lib/pagination";

const orderBy: Prisma.PublicationOrderByWithRelationInput[] = [
  { year: "desc" },
  { createdAt: "desc" },
];

async function getYears(): Promise<number[]> {
  const rows = await prisma.publication.groupBy({ by: ["year"], _count: true });
  return rows.map((row) => row.year).sort((a, b) => b - a);
}

// GET /api/papers - 获取论文列表（支持分页、搜索、年份筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const year = parseYear(searchParams.get("year"));

    const conditions: Prisma.PublicationWhereInput[] = [];
    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search } },
          { authors: { contains: search } },
        ],
      });
    }
    if (year) conditions.push({ year });
    const where: Prisma.PublicationWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    if (!pagination.paginated) {
      const papers = await prisma.publication.findMany({ where, orderBy });
      return NextResponse.json(papers);
    }

    const total = await prisma.publication.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const papers = await prisma.publication.findMany({
      where,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(
      toPageResult(papers, total, page, pagination.pageSize, await getYears())
    );
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json({ error: "获取论文失败" }, { status: 500 });
  }
}

// POST /api/papers - 创建论文
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authors, journal, year, doi, abstract } = body;

    const paper = await prisma.publication.create({
      data: {
        title,
        authors,
        journal,
        year,
        doi,
        abstract,
      },
    });

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json({ error: "创建论文失败" }, { status: 500 });
  }
}
