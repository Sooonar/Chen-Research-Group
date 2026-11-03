import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { clampPage, getTotalPages, parsePagination, toPageResult } from "@/lib/pagination";

const include = {
  members: {
    include: { member: true },
  },
  progress: {
    orderBy: { progressDate: "desc" },
  },
} satisfies Prisma.ProjectInclude;

const orderBy: Prisma.ProjectOrderByWithRelationInput = { createdAt: "desc" };

// GET /api/projects - 获取项目列表（支持分页与关键词搜索）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);
    const search = searchParams.get("search")?.trim() ?? "";

    const where: Prisma.ProjectWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { leader: { contains: search } },
          ],
        }
      : {};

    if (!pagination.paginated) {
      const projects = await prisma.project.findMany({ where, include, orderBy });
      return NextResponse.json(projects);
    }

    const total = await prisma.project.count({ where });
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const projects = await prisma.project.findMany({
      where,
      include,
      orderBy,
      skip: (page - 1) * pagination.pageSize,
      take: pagination.pageSize,
    });

    return NextResponse.json(toPageResult(projects, total, page, pagination.pageSize));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "获取项目失败" }, { status: 500 });
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      leader,
      fundingSource,
      fundingAmount,
      startDate,
      endDate,
      status,
      description,
      memberIds,
    } = body;

    const project = await prisma.project.create({
      data: {
        name,
        leader,
        fundingSource,
        fundingAmount: fundingAmount ? parseFloat(fundingAmount) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || "APPLIED",
        description,
        members: memberIds
          ? {
              create: memberIds.map((id: string) => ({
                memberId: id,
              })),
            }
          : undefined,
      },
      include: {
        members: {
          include: { member: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "创建项目失败" }, { status: 500 });
  }
}
