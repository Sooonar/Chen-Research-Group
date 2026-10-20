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
  const rows = await prisma.softwareCopyright.findMany({
    select: { registrationDate: true },
  });
  const years = new Set<number>();
  for (const row of rows) {
    if (row.registrationDate) years.add(row.registrationDate.getFullYear());
  }
  return [...years].sort((a, b) => b - a);
}

// GET /api/copyrights - 获取软件著作权列表（支持分页、搜索、年份筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";
    const year = parseYear(searchParams.get("year"));

    const conditions: Prisma.SoftwareCopyrightWhereInput[] = [];
    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search } },
          { registrationNumber: { contains: search } },
        ],
      });
    }
    if (year) {
      const { start, end } = getYearRange(year);
      conditions.push({ registrationDate: { gte: start, lt: end } });
    }
    const where: Prisma.SoftwareCopyrightWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};
    const orderBy: Prisma.SoftwareCopyrightOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (!pagination.paginated) {
      const copyrights = await prisma.softwareCopyright.findMany({ where, orderBy });
      return NextResponse.json(copyrights);
    }

    const total = await prisma.softwareCopyright.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const copyrights = await prisma.softwareCopyright.findMany({
      where,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(
      toPageResult(copyrights, total, page, pagination.pageSize, await getYears())
    );
  } catch (error) {
    console.error("Error fetching copyrights:", error);
    return NextResponse.json({ error: "获取软著失败" }, { status: 500 });
  }
}

// POST /api/copyrights
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, registrationNumber, version, registrationDate } = body;

    const copyright = await prisma.softwareCopyright.create({
      data: {
        name,
        registrationNumber,
        version,
        registrationDate: registrationDate ? new Date(registrationDate) : null,
      },
    });

    return NextResponse.json(copyright, { status: 201 });
  } catch (error) {
    console.error("Error creating copyright:", error);
    return NextResponse.json({ error: "创建软著失败" }, { status: 500 });
  }
}
