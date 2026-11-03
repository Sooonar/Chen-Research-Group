import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { deriveMemberStudyFields } from "@/lib/member-grade";

// POST /api/users/sync - 同步用户和成员数据
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

    let created = 0;
    let linked = 0;

    // 1. 为已审核但没有成员记录的用户创建成员
    const approvedUsers = await prisma.user.findMany({
      where: {
        status: "APPROVED",
        member: null,
      },
    });

    for (const user of approvedUsers) {
      // 先检查是否已有同邮箱的成员
      const existingMember = await prisma.member.findFirst({
        where: { email: user.email },
      });

      if (existingMember) {
        // 关联已有成员，顺手补上空着的学号
        await prisma.member.update({
          where: { id: existingMember.id },
          data: {
            userId: user.id,
            ...(existingMember.studentNo || !user.studentId
              ? {}
              : { studentNo: user.studentId }),
          },
        });
        linked++;
      } else {
        // 创建新成员（按入学年份自动判定身份，超过学制记为「已毕业」）
        const study = deriveMemberStudyFields({
          title: user.title,
          grade: user.grade,
          enrollmentYear: user.enrollmentYear,
        });
        await prisma.member.create({
          data: {
            userId: user.id,
            name: user.name,
            title: study.title,
            grade: study.grade,
            enrollmentYear: study.enrollmentYear,
            studentNo: user.studentId || null,
            email: user.email,
            displayOrder: study.title === "TEACHER" ? 0 : (study.grade || 1) * 10,
          },
        });
        created++;
      }
    }

    // 2. 为没有关联用户的成员按邮箱关联
    const unlinkedMembers = await prisma.member.findMany({
      where: { userId: null },
    });

    for (const member of unlinkedMembers) {
      if (member.email) {
        const user = await prisma.user.findFirst({
          where: {
            email: member.email,
            status: "APPROVED",
          },
        });

        if (user) {
          await prisma.member.update({
            where: { id: member.id },
            data: { userId: user.id },
          });
          linked++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `创建 ${created} 个成员，关联 ${linked} 个成员`,
      created,
      linked,
    });
  } catch (error) {
    console.error("Error syncing users:", error);
    return NextResponse.json({ error: "同步失败" }, { status: 500 });
  }
}
