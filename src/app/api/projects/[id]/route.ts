import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, labelOf, writeLog } from "@/lib/audit";
import { projectStatusLabels } from "@/lib/log-labels";

const projectFieldLabels = {
  name: "项目名称",
  leader: "负责人",
  fundingSource: "资助来源",
  fundingAmount: "资助金额",
  startDate: "开始日期",
  endDate: "结束日期",
  status: "状态",
  description: "项目简介",
};

const projectFormatters = {
  status: (value: unknown) => labelOf(projectStatusLabels, value),
};

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
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

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

    const before = await prisma.project.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

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

    const changes = diffRecord(before, project, projectFieldLabels, projectFormatters);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "project",
        targetId: project.id,
        targetLabel: project.name,
        summary: describeLog("UPDATE", "project", project.name),
        changes,
      });
    }

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
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.project.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "project",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "project", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "删除项目失败" }, { status: 500 });
  }
}
