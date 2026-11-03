import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: { member: true },
        },
        progress: {
          orderBy: { progressDate: "desc" },
        },
        publications: {
          include: { publication: true },
        },
        patents: {
          include: { patent: true },
        },
        copyrights: {
          include: { copyright: true },
        },
        awards: {
          include: { award: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "获取项目失败" }, { status: 500 });
  }
}

// PUT /api/projects/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        leader,
        fundingSource,
        fundingAmount: fundingAmount ? parseFloat(fundingAmount) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        description,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "更新项目失败" }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "删除项目失败" }, { status: 500 });
  }
}
