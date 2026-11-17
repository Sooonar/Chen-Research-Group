import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, writeLog } from "@/lib/audit";

const paperFieldLabels = {
  title: "标题",
  authors: "作者",
  journal: "期刊",
  year: "年份",
  doi: "DOI",
  abstract: "摘要",
};

// GET /api/papers/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paper = await prisma.publication.findUnique({
      where: { id },
    });

    if (!paper) {
      return NextResponse.json({ error: "论文不存在" }, { status: 404 });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json({ error: "获取论文失败" }, { status: 500 });
  }
}

// PUT /api/papers/[id]
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
    const { title, authors, journal, year, doi, abstract } = body;

    const before = await prisma.publication.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "论文不存在" }, { status: 404 });
    }

    const paper = await prisma.publication.update({
      where: { id },
      data: { title, authors, journal, year, doi, abstract },
    });

    const changes = diffRecord(before, paper, paperFieldLabels);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "paper",
        targetId: paper.id,
        targetLabel: paper.title,
        summary: describeLog("UPDATE", "paper", paper.title),
        changes,
      });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error("Error updating paper:", error);
    return NextResponse.json({ error: "更新论文失败" }, { status: 500 });
  }
}

// DELETE /api/papers/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.publication.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "论文不存在" }, { status: 404 });
    }

    await prisma.publication.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "paper",
      targetId: id,
      targetLabel: before.title,
      summary: describeLog("DELETE", "paper", before.title),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting paper:", error);
    return NextResponse.json({ error: "删除论文失败" }, { status: 500 });
  }
}
