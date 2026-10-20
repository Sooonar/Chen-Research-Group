"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  className?: string;
}

type PageItem = number | "gap";

/** 生成页码序列：页数较多时用省略号收拢中间页。 */
function getPageItems(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visible = new Set<number>([1, totalPages, current - 1, current, current + 1]);
  const pages = [...visible].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous = 0;
  for (const item of pages) {
    if (item - previous > 1) items.push("gap");
    items.push(item);
    previous = item;
  }
  return items;
}

/**
 * 通用分页控件：显示总条数、页码，并允许浏览者调整每页显示条数。
 * 默认每页 10 条，可在 10 / 20 / 50 / 100 之间切换。
 */
export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className = "",
}: PaginationProps) {
  if (total <= 0) return null;

  const items = getPageItems(page, totalPages);
  const buttonBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/10 px-2 text-sm transition-colors";
  const buttonState = "text-gray-300 hover:border-blue-500/40 hover:bg-white/10 hover:text-white";
  const buttonDisabled = "cursor-not-allowed opacity-40 hover:border-white/10 hover:bg-transparent hover:text-gray-300";
  const buttonActive = "border-blue-500 bg-blue-600 text-white";

  return (
    <div
      className={`mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 sm:flex-row ${className}`}
    >
      <p className="text-sm text-gray-400">
        共 <span className="font-medium text-white">{total}</span> 条
        <span className="mx-2 text-gray-600">·</span>
        第 <span className="font-medium text-white">{page}</span> / {totalPages} 页
      </p>

      <nav aria-label="分页导航" className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="上一页"
          className={`${buttonBase} ${page <= 1 ? buttonDisabled : buttonState}`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {items.map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="px-1 text-sm text-gray-500" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`第 ${item} 页`}
              aria-current={item === page ? "page" : undefined}
              className={`${buttonBase} ${item === page ? buttonActive : buttonState}`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="下一页"
          className={`${buttonBase} ${page >= totalPages ? buttonDisabled : buttonState}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      <label className="flex items-center gap-2 text-sm text-gray-400">
        每页
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="每页显示条数"
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        条
      </label>
    </div>
  );
}
