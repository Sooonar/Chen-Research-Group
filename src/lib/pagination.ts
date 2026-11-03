// 列表分页的公共约定：前后端共用同一套默认值、上限和响应结构。

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * 团队成员页按 3 列卡片网格展示，每页条数取 3 的倍数才能保证每行都是满的，
 * 因此单独给这一页一套默认值和可选值（一页 3 行 = 9 人）。
 */
export const MEMBER_DEFAULT_PAGE_SIZE = 9;
export const MEMBER_PAGE_SIZE_OPTIONS = [9, 18, 27, 45, 90];

/** 分页接口的统一响应结构。 */
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** 可选：该项列表用于年份筛选的年份集合（降序）。 */
  years?: number[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  /**
   * 只有请求显式带上 page / pageSize 时才是分页查询。
   * 不带参数时仍返回完整数组，供下拉选择、首页统计、团队预览等需要全量数据的场景使用。
   */
  paginated: boolean;
}

/** 解析 URL 查询参数中的分页信息，非法值回退到默认值。 */
export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const paginated = searchParams.has("page") || searchParams.has("pageSize");
  const rawPage = Number.parseInt(searchParams.get("page") ?? "", 10);
  const rawPageSize = Number.parseInt(searchParams.get("pageSize") ?? "", 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const pageSize = Number.isFinite(rawPageSize)
    ? Math.min(Math.max(rawPageSize, 1), MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
    paginated,
  };
}

/** 由总数计算总页数（至少 1 页，便于页面展示“第 1 / 1 页”）。 */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** 把当前页页码限制在有效范围内，避免删除数据或筛选后落到空白页。 */
export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), totalPages);
}

/** 组装分页响应。 */
export function toPageResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  years?: number[]
): PageResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: getTotalPages(total, pageSize),
    ...(years && years.length > 0 ? { years } : {}),
  };
}

/** 读取年份筛选参数，只接受合理范围内的整数。 */
export function parseYear(value: string | null): number | undefined {
  const year = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(year) || year < 1900 || year > 2200) return undefined;
  return year;
}

/** 某一年在本机时区下的起止时间，用于按日期字段筛选年份。 */
export function getYearRange(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year + 1, 0, 1),
  };
}
