import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { toAwardCategory } from "@/lib/award-category";

// GET /api/submissions - 获取提交列表
export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where: any = {};

    // 管理员可以查看所有提交，普通用户只能查看自己的
    if (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN") {
      where.userId = currentUser.id;
    } else if (userId) {
      where.userId = userId;
    }

    if (status) where.status = status;

    const submissions = await prisma.achievement.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "获取提交列表失败" }, { status: 500 });
  }
}

// POST /api/submissions - 提交新成果
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const body = await request.json();
    const { type, data } = body;

    let targetId: string;

    // 根据类型创建对应的成果记录
    switch (type) {
      case "PUBLICATION":
        const paper = await prisma.publication.create({
          data: {
            title: data.title,
            authors: data.authors,
            journal: data.journal,
            year: parseInt(data.year),
            doi: data.doi || null,
            abstract: data.abstract || null,
            status: "PENDING",
            submittedBy: currentUser.id,
          },
        });
        targetId = paper.id;
        break;

      case "PATENT":
        const patent = await prisma.patent.create({
          data: {
            name: data.name,
            patentNumber: data.patentNumber,
            patentType: data.patentType,
            status: data.status || "APPLIED",
            applicationDate: data.applicationDate ? new Date(data.applicationDate) : null,
            authorizationDate: data.authorizationDate ? new Date(data.authorizationDate) : null,
            inventors: data.inventors,
            reviewStatus: "PENDING",
            submittedBy: currentUser.id,
          },
        });
        targetId = patent.id;
        break;

      case "COPYRIGHT":
        const copyright = await prisma.softwareCopyright.create({
          data: {
            name: data.name,
            registrationNumber: data.registrationNumber,
            version: data.version || null,
            registrationDate: data.registrationDate ? new Date(data.registrationDate) : null,
            reviewStatus: "PENDING",
            submittedBy: currentUser.id,
          },
        });
        targetId = copyright.id;
        break;

      case "AWARD":
        const award = await prisma.award.create({
          data: {
            name: data.name,
            competition: data.competition,
            category: toAwardCategory(data.category),
            winners: data.winners,
            year: parseInt(data.year),
            description: data.description || null,
            imageUrl: data.imageUrl || null,
            reviewStatus: "PENDING",
            submittedBy: currentUser.id,
          },
        });
        targetId = award.id;
        break;

      default:
        return NextResponse.json({ error: "不支持的成果类型" }, { status: 400 });
    }

    // 创建提交记录
    const submission = await prisma.achievement.create({
      data: {
        userId: currentUser.id,
        type,
        targetId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}
