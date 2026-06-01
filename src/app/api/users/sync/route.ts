import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// POST /api/users/sync - 为所有已审核用户创建成员记录
export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 检查权限
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    // 获取所有已审核但没有成员记录的用户
    const approvedUsers = await prisma.user.findMany({
      where: {
        status: "APPROVED",
        member: null,
      },
    });

    let created = 0;

    for (const user of approvedUsers) {
      const memberTitle = user.title || "MASTER";

      await prisma.member.create({
        data: {
          userId: user.id,
          name: user.name,
          title: memberTitle,
          grade: memberTitle === "MASTER" ? user.grade : null,
          email: user.email,
          displayOrder: memberTitle === "TEACHER" ? 0 : (user.grade || 1) * 10,
        },
      });

      created++;
    }

    return NextResponse.json({
      success: true,
      message: `成功为 ${created} 个用户创建成员记录`,
      created,
    });
  } catch (error) {
    console.error("Error syncing users:", error);
    return NextResponse.json({ error: "同步失败" }, { status: 500 });
  }
}
