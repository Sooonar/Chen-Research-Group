import { NextResponse } from "next/server";
import type { Member, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampPage,
  getTotalPages,
  parsePagination,
  toPageResult,
} from "@/lib/pagination";

// 成员排序权重：老师 > 研三 > 研二 > 研一
const titleOrder: Record<string, number> = {
  TEACHER: 0,
  MASTER: 10,
  ALUMNI: 100,
};

const memberTitles = ["TEACHER", "MASTER", "ALUMNI"] as const;
type MemberTitleValue = (typeof memberTitles)[number];

function getGradeOrder(grade: number | null): number {
  if (!grade) return 0;
  // 与历史行为保持一致：同职称内按年级升序（研一 → 研三）排列
  return 4 - grade;
}

interface SortableMember {
  id: string;
  title: string;
  grade: number | null;
  displayOrder: number;
  createdAt: Date;
}

function compareMembers(a: SortableMember, b: SortableMember): number {
  const orderA = titleOrder[a.title] ?? 50;
  const orderB = titleOrder[b.title] ?? 50;

  // 首先按职称排序
  if (orderA !== orderB) return orderA - orderB;

  // 同一职称内，按年级排序
  if (a.title === "MASTER" && b.title === "MASTER") {
    const gradeA = getGradeOrder(a.grade);
    const gradeB = getGradeOrder(b.grade);
    if (gradeA !== gradeB) return gradeB - gradeA;
  }

  // 最后按 displayOrder 排序，并用创建时间保证分页顺序稳定
  if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
  return a.createdAt.getTime() - b.createdAt.getTime();
}

// GET /api/members - 获取成员列表（支持分页、搜索、职称与年级筛选）
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const pagination = parsePagination(searchParams);

    const search = searchParams.get("search")?.trim() ?? "";
    const titleParam = searchParams.get("title");
    const title = memberTitles.includes(titleParam as MemberTitleValue)
      ? (titleParam as MemberTitleValue)
      : undefined;

    const gradeParam = Number.parseInt(searchParams.get("grade") ?? "", 10);
    const grade =
      Number.isFinite(gradeParam) && gradeParam >= 1 && gradeParam <= 3
        ? gradeParam
        : undefined;

    const conditions: Prisma.MemberWhereInput[] = [];
    if (title) conditions.push({ title });
    if (grade !== undefined) conditions.push({ grade });
    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search } },
          { researchDirection: { contains: search } },
        ],
      });
    }
    const where: Prisma.MemberWhereInput = conditions.length > 0 ? { AND: conditions } : {};

    if (!pagination.paginated) {
      const members = await prisma.member.findMany({ where });
      members.sort(compareMembers);
      return NextResponse.json(members);
    }

    // 排序依赖“职称权重 + 年级”，先只取排序需要的字段，再按当前页取完整记录。
    const sortable = await prisma.member.findMany({
      where,
      select: {
        id: true,
        title: true,
        grade: true,
        displayOrder: true,
        createdAt: true,
      },
    });
    sortable.sort(compareMembers);

    const total = sortable.length;
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const pageIds = sortable
      .slice((page - 1) * pagination.pageSize, page * pagination.pageSize)
      .map((member) => member.id);

    const rows: Member[] =
      pageIds.length > 0
        ? await prisma.member.findMany({ where: { id: { in: pageIds } } })
        : [];
    const rowsById = new Map(rows.map((member) => [member.id, member]));
    const items = pageIds
      .map((id) => rowsById.get(id))
      .filter((member): member is Member => Boolean(member));

    return NextResponse.json(toPageResult(items, total, page, pagination.pageSize));
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
