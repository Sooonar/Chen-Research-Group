import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// PUT /api/users/[id] - 更新用户信息（审核、角色分配）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { status, role } = body;

    // 只有超级管理员可以修改角色
    if (role && currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "只有超级管理员可以修改角色" }, { status: 403 });
    }

    // 获取要更新的用户信息
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    // 如果状态变为通过，且没有成员记录，则自动创建
    if (status === "APPROVED" && !targetUser.member) {
      const memberTitle = targetUser.title || "MASTER";
      
      await prisma.member.create({
        data: {
          userId: id,
          name: targetUser.name,
          title: memberTitle,
          grade: memberTitle === "MASTER" ? targetUser.grade : null,
          email: targetUser.email,
          displayOrder: memberTitle === "TEACHER" ? 0 : (targetUser.grade || 1) * 10,
        },
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        title: true,
        grade: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 });
  }
}

// DELETE /api/users/[id] - 删除用户
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 检查权限（只有超级管理员可以删除用户）
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "只有超级管理员可以删除用户" }, { status: 403 });
    }

    const { id } = await params;

    // 不能删除自己
    if (currentUser.id === id) {
      return NextResponse.json({ error: "不能删除自己" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
}
