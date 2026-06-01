import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/profile - 获取当前用户信息
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        member: true,
        submissions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 不返回密码
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}

// PUT /api/user/profile - 更新当前用户信息
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await request.json();
    const { name, studentId, title, grade, researchDirection, bio } = body;

    // 更新用户基本信息
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        studentId,
        title,
        grade: grade ? parseInt(grade.toString()) : null,
      },
      include: {
        member: true,
      },
    });

    // 如果用户已审核通过且有成员记录，同步更新成员信息
    if (user.status === "APPROVED" && user.member) {
      await prisma.member.update({
        where: { id: user.member.id },
        data: {
          name,
          title: title || user.member.title,
          grade: title === "MASTER" ? (grade ? parseInt(grade.toString()) : user.member.grade) : null,
          researchDirection,
          bio,
          email: user.email,
        },
      });
    }
    // 如果用户已审核通过但没有成员记录，创建成员记录
    else if (user.status === "APPROVED" && !user.member) {
      const memberTitle = title || "MASTER";
      await prisma.member.create({
        data: {
          userId: user.id,
          name,
          title: memberTitle,
          grade: memberTitle === "MASTER" ? (grade ? parseInt(grade.toString()) : null) : null,
          researchDirection,
          bio,
          email: user.email,
          displayOrder: memberTitle === "TEACHER" ? 0 : (grade || 1) * 10,
        },
      });
    }

    // 重新获取完整用户信息
    const updatedUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        member: true,
        submissions: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
