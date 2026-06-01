import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 成员排序权重：老师 > 研三 > 研二 > 研一
const titleOrder: Record<string, number> = {
  TEACHER: 0,
  MASTER: 10,
  ALUMNI: 100,
};

function getGradeOrder(grade: number | null): number {
  if (!grade) return 0;
  // 研三(3) > 研二(2) > 研一(1)，所以用 4-grade 来反转排序
  return 4 - grade;
}

// GET /api/members - 获取成员列表
export async function GET() {
  try {
    const members = await prisma.member.findMany();

    // 排序：老师 > 研三 > 研二 > 研一 > 已毕业
    members.sort((a, b) => {
      const orderA = titleOrder[a.title] ?? 50;
      const orderB = titleOrder[b.title] ?? 50;

      // 首先按职称排序
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 同一职称内，按年级排序（研三 > 研二 > 研一）
      if (a.title === "MASTER" && b.title === "MASTER") {
        const gradeA = getGradeOrder(a.grade);
        const gradeB = getGradeOrder(b.grade);
        if (gradeA !== gradeB) {
          return gradeB - gradeA;
        }
      }

      // 最后按 displayOrder 排序
      return a.displayOrder - b.displayOrder;
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "获取成员失败" }, { status: 500 });
  }
}

// POST /api/members - 创建成员
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, title, grade, researchDirection, bio, email, displayOrder } = body;

    const member = await prisma.member.create({
      data: {
        name,
        title,
        grade: grade ? parseInt(grade.toString()) : null,
        researchDirection,
        bio,
        email,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "创建成员失败" }, { status: 500 });
  }
}
