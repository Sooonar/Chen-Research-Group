import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildStudyPatch,
  withComputedGrade,
} from "@/lib/member-grade";
import { requireAdmin } from "@/lib/api-auth";
import { describeLog, diffRecord, labelOf, writeLog } from "@/lib/audit";
import { memberTitleLabels } from "@/lib/log-labels";

const memberFieldLabels = {
  name: "姓名",
  title: "身份",
  grade: "年级",
  enrollmentYear: "入学年份",
  studentNo: "学号",
  phone: "手机号",
  department: "院系",
  major: "专业",
  programType: "学生类别",
  thesisTitle: "论文题目",
  researchDirection: "研究方向",
  email: "邮箱",
  displayOrder: "展示排序",
  isGraduated: "是否已毕业",
  graduationYear: "毕业年份",
};

const memberFormatters = {
  title: (value: unknown) => labelOf(memberTitleLabels, value),
};

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
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

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

    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "成员不存在" }, { status: 404 });
    }

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

    const changes = diffRecord(before, member, memberFieldLabels, memberFormatters);
    if (changes.length > 0) {
      await writeLog({
        request,
        actor,
        action: "UPDATE",
        module: "member",
        targetId: member.id,
        targetLabel: member.name,
        summary: describeLog("UPDATE", "member", member.name),
        changes,
      });
    }

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
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const actor = guard.user;

  try {
    const { id } = await params;
    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "成员不存在" }, { status: 404 });
    }

    await prisma.member.delete({
      where: { id },
    });

    await writeLog({
      request,
      actor,
      action: "DELETE",
      module: "member",
      targetId: id,
      targetLabel: before.name,
      summary: describeLog("DELETE", "member", before.name),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "删除成员失败" }, { status: 500 });
  }
}
