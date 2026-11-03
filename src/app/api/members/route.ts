import { NextResponse } from "next/server";
import type { Member, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  clampPage,
  getTotalPages,
  parsePagination,
  toPageResult,
} from "@/lib/pagination";
import {
  buildStudyPatch,
  resolveMemberGrade,
  withComputedGrade,
} from "@/lib/member-grade";

// 成员排序权重：老师 > 研三 > 研二 > 研一
const titleOrder: Record<string, number> = {
  TEACHER: 0,
  MASTER: 10,
  ALUMNI: 100,
};

const memberTitles = ["TEACHER", "MASTER", "ALUMNI"] as const;
type MemberTitleValue = (typeof memberTitles)[number];

interface SortableMember {
  id: string;
  title: string;
  grade: number | null;
  enrollmentYear?: number | null;
  displayOrder: number;
  createdAt: Date;
}

function compareMembers(a: SortableMember, b: SortableMember): number {
  const orderA = titleOrder[a.title] ?? 50;
  const orderB = titleOrder[b.title] ?? 50;

  // 首先按职称排序
  if (orderA !== orderB) return orderA - orderB;

  // 同一职称内，按年级倒序：研三 → 研二 → 研一。
  // 年级由入学年份实时推算，没有年级信息（含已超学制）的排在最后。
  if (a.title === "MASTER" && b.title === "MASTER") {
    const gradeA = resolveMemberGrade(a).grade ?? 0;
    const gradeB = resolveMemberGrade(b).grade ?? 0;
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
    const gradeFilter =
      Number.isFinite(gradeParam) && gradeParam >= 1 && gradeParam <= 3
        ? gradeParam
        : undefined;

    const conditions: Prisma.MemberWhereInput[] = [];
    if (title) conditions.push({ title });
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
      // 年级是按入学年份算出来的，SQL 里没法筛，放到内存里处理（成员量级很小）
      const computed = members.map((member) => withComputedGrade(member));
      const filtered = gradeFilter
        ? computed.filter((member) => member.grade === gradeFilter)
        : computed;
      return NextResponse.json(filtered);
    }

    // 排序依赖“职称权重 + 年级”，先只取排序需要的字段，再按当前页取完整记录。
    const sortable = await prisma.member.findMany({
      where,
      select: {
        id: true,
        title: true,
        grade: true,
        enrollmentYear: true,
        displayOrder: true,
        createdAt: true,
      },
    });
    sortable.sort(compareMembers);

    const matched = gradeFilter
      ? sortable.filter((member) => resolveMemberGrade(member).grade === gradeFilter)
      : sortable;

    const total = matched.length;
    const totalPages = getTotalPages(total, pagination.pageSize);
    const page = clampPage(pagination.page, totalPages);
    const pageIds = matched
      .slice((page - 1) * pagination.pageSize, page * pagination.pageSize)
      .map((member) => member.id);

    const rows: Member[] =
      pageIds.length > 0
        ? await prisma.member.findMany({ where: { id: { in: pageIds } } })
        : [];
    const rowsById = new Map(rows.map((member) => [member.id, member]));
    const items = pageIds
      .map((id) => rowsById.get(id))
      .filter((member): member is Member => Boolean(member))
      .map((member) => withComputedGrade(member));

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
    } = body;

    // 年级由入学年份推算；只给了年级时反推入学年份，两个字段保持同步
    const { grade: finalGrade = null, enrollmentYear: finalEnrollmentYear = null } =
      buildStudyPatch({ title, grade, enrollmentYear });

    const member = await prisma.member.create({
      data: {
        name,
        title,
        grade: finalGrade,
        enrollmentYear: finalEnrollmentYear,
        studentNo: studentNo || null,
        phone: phone || null,
        department: department || null,
        major: major || null,
        programType: programType || null,
        thesisTitle: thesisTitle || null,
        researchDirection,
        bio,
        email,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(withComputedGrade(member), { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "创建成员失败" }, { status: 500 });
  }
}
