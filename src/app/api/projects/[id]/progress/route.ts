import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { writeLog } from "@/lib/audit";

// POST /api/projects/[id]/progress - 添加项目进展
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, progressDate, attachments } = body;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { name: true },
    });
    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    const progress = await prisma.projectProgress.create({
      data: {
        projectId: id,
        title,
        content,
        progressDate: new Date(progressDate),
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
    });

    await writeLog({
      request,
      actor,
      action: "CREATE",
      module: "project",
      targetId: progress.id,
      targetLabel: `${project.name} · ${progress.title}`,
      summary: `为科研项目「${project.name}」新增进展「${progress.title}」`,
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error("Error adding progress:", error);
    return NextResponse.json({ error: "添加进展失败" }, { status: 500 });
  }
}
