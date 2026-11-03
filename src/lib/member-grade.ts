
// 成员年级的统一推算逻辑：数据库只存入学年份，年级按当前学年实时算出来。
//
// 学年从 9 月开始：2026-09-01 ~ 2027-08-31 属于 2026 学年。
// 例：2024 年入学 → 2024 学年为研一，2025 学年研二，2026 学年研三，2027 学年起算毕业。

/** 硕士学制（年）。 */
export const MASTER_PROGRAM_YEARS = 3;

/** 学年起始月份（9 月开学）。 */
export const ACADEMIC_YEAR_START_MONTH = 9;

/** 入学年份最多可以选到「当前学年 + N」，留给提前拿到录取通知的新生注册。 */
export const MAX_FUTURE_ENROLLMENT_YEARS = 2;

/** 入学年份的下限：固定 2000（不随学年浮动，否则老校友以后就选不到了）。 */
export const MIN_ENROLLMENT_YEAR = 2000;

export const gradeLabels: Record<number, string> = {
  1: "研一",
  2: "研二",
  3: "研三",
};

/** 取某个时刻所属的学年，如 2026-11-03 → 2026，2026-03-01 → 2025。 */
export function getAcademicYear(date: Date = new Date()): number {
  return date.getMonth() + 1 >= ACADEMIC_YEAR_START_MONTH
    ? date.getFullYear()
    : date.getFullYear() - 1;
}

/**
 * 由入学年份推算年级。
 * 超过学制返回 null（表示已毕业，需要管理员把身份改为「已毕业」才会进入校友分组）。
 */
export function deriveGrade(
  enrollmentYear: number | null | undefined,
  date: Date = new Date()
): number | null {
  if (!enrollmentYear) return null;
  const grade = getAcademicYear(date) - enrollmentYear + 1;
  if (grade < 1 || grade > MASTER_PROGRAM_YEARS) return null;
  return grade;
}

/** 由年级反推入学年份，用于「只填了年级」的旧表单 / 接口保持兼容。 */
export function enrollmentYearFromGrade(
  grade: number | null | undefined,
  date: Date = new Date()
): number | null {
  if (!grade) return null;
  return getAcademicYear(date) - grade + 1;
}

/** 解析前端传来的年份/年级，空值、空串、非法值统一返回 null。 */
export function toIntOrNull(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export interface StudyPatch {
  grade?: number | null;
  enrollmentYear?: number | null;
}

/**
 * 生成成员「年级 / 入学年份」的写入补丁，供各处接口复用。
 *
 * 关键规则：**留空（null / 空串）等于不改动，不能当清空**——前端表单没填时
 * 一般会传 null，如果直接写库就会把原有年级抹掉。
 * - 老师：没有学籍信息，清空；
 * - 已毕业（ALUMNI）：**保留入学年份**，方便日后查档，只是不再展示"研几"；
 * - 硕士生：填了入学年份就用它重算年级，只填年级则反推入学年份，都没填保持原值。
 */
export function buildStudyPatch(input: {
  title?: string | null;
  grade?: unknown;
  enrollmentYear?: unknown;
}): StudyPatch {
  const enrollmentYear = toIntOrNull(input.enrollmentYear);
  const grade = toIntOrNull(input.grade);

  if (input.title === "TEACHER") {
    return { grade: null, enrollmentYear: null };
  }
  if (input.title === "ALUMNI") {
    // 已毕业只关心"哪一年入学"；年级不参与排序和展示，统一置空
    return enrollmentYear !== null ? { grade: null, enrollmentYear } : {};
  }
  if (enrollmentYear !== null) {
    return { grade: deriveGrade(enrollmentYear), enrollmentYear };
  }
  if (grade !== null) {
    return { grade, enrollmentYear: enrollmentYearFromGrade(grade) };
  }
  return {};
}

/** 与 Prisma 的 MemberTitle 枚举一致（没有 PHD）。 */
export type MemberTitleLike = "TEACHER" | "MASTER" | "ALUMNI";

/**
 * 按入学年份自动判定身份：
 * - 选了未来年份 → 仍是硕士生（预入学，年级为空）；
 * - 入学超过学制 → 自动算「已毕业」（ALUMNI）；
 * - 其他不变（老师、博士生、已毕业保持原样）。
 * 注册、审核、个人中心保存时都用它，避免"毕业多年还挂研三"。
 */
export function resolveTitleForEnrollment(
  title: MemberTitleLike | null | undefined,
  enrollmentYear: number | null | undefined,
  date: Date = new Date()
): MemberTitleLike {
  const current = title ?? "MASTER";
  if (current !== "MASTER" || !enrollmentYear) return current;

  const academicYear = getAcademicYear(date);
  if (enrollmentYear > academicYear) return current; // 预入学，还没到入学学年
  if (academicYear - enrollmentYear + 1 > MASTER_PROGRAM_YEARS) return "ALUMNI";
  return current;
}

export interface MemberStudyFields {
  title: MemberTitleLike;
  grade: number | null;
  enrollmentYear: number | null;
}

/**
 * 由「注册身份 + 年级 / 入学年份」推导出成员应存的 title / grade / enrollmentYear。
 * 用于审核通过、账号同步、个人中心保存等"从账号落到档案"的场景。
 */
export function deriveMemberStudyFields(
  input: { title?: string | null; grade?: number | null; enrollmentYear?: number | null },
  date: Date = new Date()
): MemberStudyFields {
  const enrollmentYear = input.enrollmentYear ?? enrollmentYearFromGrade(input.grade, date);
  const title = resolveTitleForEnrollment(
    (input.title ?? "MASTER") as MemberTitleLike,
    enrollmentYear,
    date
  );

  return {
    title,
    grade: title === "MASTER" ? deriveGrade(enrollmentYear, date) : null,
    enrollmentYear: title === "TEACHER" ? null : enrollmentYear,
  };
}

export interface MemberGradeSource {
  title?: string | null;
  grade?: number | null;
  enrollmentYear?: number | null;
}

export interface ResolvedGrade {
  /** 实际展示用的年级 1~3；null 表示没有年级或已超出学制。 */
  grade: number | null;
  /** 是否已超出学制（读库值或入学年份推算都得不出有效年级）。 */
  overdue: boolean;
}

/**
 * 计算成员当前年级：
 * 1. 有入学年份 → 用它推算（新逻辑，会随时间自动变化）；
 * 2. 没有入学年份 → 退回库里存的 grade（兼容尚未回填的历史数据）。
 * 老师、校友不参与年级计算。
 */
export function resolveMemberGrade(
  member: MemberGradeSource,
  date: Date = new Date()
): ResolvedGrade {
  if (member.title && member.title !== "MASTER") {
    return { grade: null, overdue: false };
  }

  if (member.enrollmentYear) {
    const grade = deriveGrade(member.enrollmentYear, date);
    return { grade, overdue: grade === null };
  }

  return { grade: member.grade ?? null, overdue: false };
}

/** 在成员对象上覆盖为推算出的年级，供接口直接返回给前端。 */
export function withComputedGrade<T extends MemberGradeSource>(
  member: T,
  date: Date = new Date()
): T & { grade: number | null } {
  return { ...member, grade: resolveMemberGrade(member, date).grade };
}
