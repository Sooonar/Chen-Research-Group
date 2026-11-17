import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, labelOf, writeLog } from "@/lib/audit";
import { newsCategoryLabels } from "@/lib/log-labels";

const newsFieldLabels = {
  title: "标题",
  summary: "摘要",
  content: "正文",
  category: "分类",
  coverImage: "封面图",
  isPublished: "发布状态",
};

const newsFormatters = {
  category: (value: unknown) => labelOf(newsCategoryLabels, value),
  isPublished: (value: unknown) => (value ? "已发布" : "草稿"),
};

// GET /api/news/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json({ error: "新闻不存在" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}

// PUT /api/news/[id]
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
    const { title, summary, content, category, coverImage, isPublished } = body;

    const before = await prisma.news.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "新闻不存在" }, { status: 404 });
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        category,
        coverImage,
        isPublished,
      },
    });

    const changes = diffRecord(before, news, newsFieldLabels, newsFormatters);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "news",
        targetId: news.id,
        targetLabel: news.title,
        summary: describeLog("UPDATE", "news", news.title),
        changes,
      });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "更新新闻失败" }, { status: 500 });
  }
}

// DELETE /api/news/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.news.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "新闻不存在" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "news",
      targetId: id,
      targetLabel: before.title,
      summary: describeLog("DELETE", "news", before.title),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "删除新闻失败" }, { status: 500 });
  }
}
