import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: { member: true },
        },
        progress: {
          orderBy: { progressDate: "desc" },
        },
        competitions: {
          include: {
            award: { select: { id: true, name: true, level: true } },
          },
          orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
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
