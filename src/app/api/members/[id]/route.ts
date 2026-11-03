import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildStudyPatch,
  withComputedGrade,
} from "@/lib/member-grade";

// GET /api/members/[id] - 获取单个成员
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        publications: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "成员不存在" }, { status: 404 });
    }

    return NextResponse.json(withComputedGrade(member));
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "获取成员失败" }, { status: 500 });
  }
}

// PUT /api/members/[id] - 更新成员
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      title,
      grade,
      enrollmentYear,
      studentNo,
      phone,
      department,
      major,
      programType,
      thesisTitle,
      researchDirection,
      bio,
      email,
      displayOrder,
      isGraduated,
      graduationYear,
    } = body;

    // 年级 / 入学年份：留空（表单传 null）代表"不改"，具体规则见 buildStudyPatch
    const gradePatch = buildStudyPatch({ title, grade, enrollmentYear });

    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        title,
        ...gradePatch,
        ...(studentNo !== undefined ? { studentNo: studentNo || null } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(department !== undefined ? { department: department || null } : {}),
        ...(major !== undefined ? { major: major || null } : {}),
        ...(programType !== undefined ? { programType: programType || null } : {}),
        ...(thesisTitle !== undefined ? { thesisTitle: thesisTitle || null } : {}),
        researchDirection,
        bio,
        email,
        displayOrder,
        isGraduated,
        graduationYear,
      },
    });

    return NextResponse.json(withComputedGrade(member));
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "更新成员失败" }, { status: 500 });
  }
}

// DELETE /api/members/[id] - 删除成员
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "删除成员失败" }, { status: 500 });
  }
}
