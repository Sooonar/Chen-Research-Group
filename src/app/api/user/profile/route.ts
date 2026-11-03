import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { deriveMemberStudyFields, enrollmentYearFromGrade, toIntOrNull, withComputedGrade } from "@/lib/member-grade";

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

    // 不返回密码；成员的年级按入学年份实时推算后返回
    const { password: _, ...userWithoutPassword } = user;
    const payload = {
      ...userWithoutPassword,
      member: user.member ? withComputedGrade(user.member) : null,
    };

    return NextResponse.json(payload);
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
    const {
      name,
      studentId,
      title,
      grade,
      enrollmentYear,
      phone,
      department,
      major,
      programType,
      thesisTitle,
      researchDirection,
      bio,
    } = body;

    // 学籍类字段：没传就不动，传空串则清空
    const profilePatch = {
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(department !== undefined ? { department: department || null } : {}),
      ...(major !== undefined ? { major: major || null } : {}),
      ...(programType !== undefined ? { programType: programType || null } : {}),
      ...(thesisTitle !== undefined ? { thesisTitle: thesisTitle || null } : {}),
    };

    // 年级 / 入学年份：留空代表"不改"，最终身份由 deriveMemberStudyFields 判定
    const gradeInput = toIntOrNull(grade);
    const derivedEnrollmentYear = toIntOrNull(enrollmentYear) ?? enrollmentYearFromGrade(gradeInput);

    // 更新用户基本信息
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        studentId,
        title,
        grade: gradeInput,
        // 学生改「研几」时同步换算成入学年份，两个字段保持一致
        ...(gradeInput !== null || toIntOrNull(enrollmentYear) !== null
          ? { enrollmentYear: derivedEnrollmentYear }
          : {}),
      },
      include: {
        member: true,
      },
    });

    // 如果用户已审核通过且有成员记录，同步更新成员信息
    if (user.status === "APPROVED" && user.member) {
      // 身份按入学年份自动判定：超过学制记为「已毕业」
      const study = deriveMemberStudyFields({
        title: title || user.member.title,
        grade: gradeInput ?? user.member.grade,
        enrollmentYear: toIntOrNull(enrollmentYear) ?? user.member.enrollmentYear,
      });

      await prisma.member.update({
        where: { id: user.member.id },
        data: {
          name,
          title: study.title,
          grade: study.grade,
          enrollmentYear: study.enrollmentYear,
          ...profilePatch,
          ...(studentId ? { studentNo: studentId } : {}),
          researchDirection,
          bio,
          email: user.email,
        },
      });
    }
    // 如果用户已审核通过但没有成员记录，创建成员记录
    else if (user.status === "APPROVED" && !user.member) {
      const study = deriveMemberStudyFields({
        title: title || "MASTER",
        grade: gradeInput,
        enrollmentYear: derivedEnrollmentYear,
      });
      await prisma.member.create({
        data: {
          userId: user.id,
          name,
          title: study.title,
          grade: study.grade,
          enrollmentYear: study.enrollmentYear,
          ...profilePatch,
          studentNo: studentId || null,
          researchDirection,
          bio,
          email: user.email,
          displayOrder: study.title === "TEACHER" ? 0 : (study.grade || 1) * 10,
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

    return NextResponse.json({
      ...userWithoutPassword,
      member: updatedUser.member ? withComputedGrade(updatedUser.member) : null,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
