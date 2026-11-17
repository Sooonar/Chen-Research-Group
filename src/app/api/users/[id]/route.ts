import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { deriveMemberStudyFields } from "@/lib/member-grade";
import { diffRecord, labelOf, writeLog } from "@/lib/audit";
import { roleLabels, userStatusLabels } from "@/lib/log-labels";

const userFieldLabels = {
  status: "账号状态",
  role: "角色",
};

const userFormatters = {
  status: (value: unknown) => labelOf(userStatusLabels, value),
  role: (value: unknown) => labelOf(roleLabels, value),
};

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

    const updateData: Prisma.UserUpdateInput = {};
    if (status) updateData.status = status as Prisma.UserUpdateInput["status"];
    if (role) updateData.role = role as Prisma.UserUpdateInput["role"];

    // 如果状态变为通过，且没有成员记录，则自动创建
    let createdMember = false;
    if (status === "APPROVED" && !targetUser.member) {
      // 按入学年份自动判定身份：超过学制直接记为「已毕业」
      const study = deriveMemberStudyFields({
        title: targetUser.title,
        grade: targetUser.grade,
        enrollmentYear: targetUser.enrollmentYear,
      });

      await prisma.member.create({
        data: {
          userId: id,
          name: targetUser.name,
          title: study.title,
          grade: study.grade,
          enrollmentYear: study.enrollmentYear,
          studentNo: targetUser.studentId || null,
          email: targetUser.email,
          displayOrder: study.title === "TEACHER" ? 0 : (study.grade || 1) * 10,
        },
      });
      createdMember = true;
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

    const changes = diffRecord(targetUser, user, userFieldLabels, userFormatters);
    if (changes.length > 0 || createdMember) {
      const parts: string[] = [];
      if (targetUser.status !== user.status) {
        parts.push(
          user.status === "APPROVED"
            ? `审核通过用户「${user.name}」`
            : user.status === "REJECTED"
              ? `拒绝用户「${user.name}」`
              : `将用户「${user.name}」状态改为${labelOf(userStatusLabels, user.status)}`
        );
      }
      if (targetUser.role !== user.role) {
        parts.push(`将用户「${user.name}」角色改为${labelOf(roleLabels, user.role)}`);
      }

      await writeLog({
        request,
        actor: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        },
        action: "UPDATE",
        module: "user",
        targetId: user.id,
        targetLabel: user.name,
        summary: parts.join("，并") || `修改用户「${user.name}」`,
        changes,
        detail: createdMember ? "审核通过时自动创建了成员记录" : null,
      });
    }

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

    const target = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });
    if (!target) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    await writeLog({
      request,
      actor: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      action: "DELETE",
      module: "user",
      targetId: id,
      targetLabel: target.name,
      summary: `删除用户「${target.name}」`,
      detail: target.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
}
