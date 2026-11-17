import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, writeLog } from "@/lib/audit";

// GET /api/news - 获取新闻列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const where: Prisma.NewsWhereInput = {};
    if (category) where.category = category as Prisma.NewsWhereInput["category"];
    if (published !== null) where.isPublished = published === "true";

    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "获取新闻失败" }, { status: 500 });
  }
}

// POST /api/news - 创建新闻
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const body = await request.json();
    const { title, summary, content, category, coverImage, isPublished, authorId } = body;

    const news = await prisma.news.create({
      data: {
        title,
        summary,
        content,
        category: category || "GROUP",
        coverImage,
        isPublished: isPublished || false,
        authorId,
      },
    });

    await writeLog({
      request,
      actor,
      action: "CREATE",
      module: "news",
      targetId: news.id,
      targetLabel: news.title,
      summary: describeLog("CREATE", "news", news.title),
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "创建新闻失败" }, { status: 500 });
  }
}
