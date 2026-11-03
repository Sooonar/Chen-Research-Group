"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";
import type { PageResult } from "@/lib/pagination";
import {
  AWARD_CATEGORIES,
  awardCategoryLabels,
  type AwardCategory,
} from "@/lib/award-category";

interface AwardRecord {
  id: string;
  name: string;
  competition: string;
  category: string;
  winners: string;
  year: number;
  description: string | null;
  imageUrl: string | null;
  submittedBy: string | null;
}

const categoryBadgeClass: Record<string, string> = {
  RESEARCH: "bg-blue-500/20 text-blue-400",
  TEACHING: "bg-purple-500/20 text-purple-400",
  COMPETITION: "bg-yellow-500/20 text-yellow-400",
  ACADEMIC: "bg-green-500/20 text-green-400",
};

export default function AwardsPage() {
  const [activeCategory, setActiveCategory] = useState<AwardCategory | "all">("all");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      year: selectedYear === "all" ? undefined : selectedYear,
      category: activeCategory === "all" ? undefined : activeCategory,
    }),
    [debouncedSearch, selectedYear, activeCategory]
  );

  const list = usePaginatedList<AwardRecord>("/api/awards", query);
  const { resetPage } = list;

  // 分类 tab 上的数量始终展示各分类总数，不随当前搜索条件变化。
  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      const targets: Array<AwardCategory | "all"> = ["all", ...AWARD_CATEGORIES];
      const entries = await Promise.all(
        targets.map(async (target) => {
          try {
            const params = new URLSearchParams({ page: "1", pageSize: "1" });
            if (target !== "all") params.set("category", target);
            const res = await fetch(`/api/awards?${params.toString()}`, {
              cache: "no-store",
            });
            if (!res.ok) return [target, 0] as const;
            const data = (await res.json()) as PageResult<unknown>;
            return [target, data.total ?? 0] as const;
          } catch {
            return [target, 0] as const;
          }
        })
      );
      if (!cancelled) {
        setCounts(Object.fromEntries(entries));
      }
    }

    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  // 输入停止 300ms 后再查询。
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      resetPage();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, resetPage]);

  const handleCategoryChange = (target: AwardCategory | "all") => {
    if (target === activeCategory) return;
    setActiveCategory(target);
    setSelectedYear("all");
    setSearch("");
    setDebouncedSearch("");
    resetPage();
  };

  const awards = list.items;
  const loadingInitial = list.loading && list.items.length === 0;

  const tabs: Array<{ id: AwardCategory | "all"; label: string }> = [
    { id: "all", label: "全部" },
    ...AWARD_CATEGORIES.map((category) => ({
      id: category,
      label: awardCategoryLabels[category],
    })),
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">
              <span className="gradient-text">获奖荣誉</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              展示课题组在科研、教学、竞赛和学业方面获得的荣誉
            </p>
          </motion.div>

          {/* 分类 Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {tab.label}
                <span className="text-xs opacity-75">({counts[tab.id] ?? 0})</span>
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 搜索与年份 */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索名称、赛事/机构或成员"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(
                    event.target.value === "all" ? "all" : Number(event.target.value)
                  );
                  resetPage();
                }}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="按年份筛选"
              >
                <option value="all">全部年份</option>
                {list.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {loadingInitial ? (
              <div className="py-16 text-center text-gray-400">加载中...</div>
            ) : (
              <>
                <div
                  className={
                    list.loading ? "opacity-60 transition-opacity" : "transition-opacity"
                  }
                >
                  {awards.length === 0 ? (
                    <div className="glass-card p-8 text-center text-gray-400">
                      暂无获奖记录
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {awards.map((award, index) => (
                        <motion.div
                          key={award.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index, 9) * 0.05 }}
                          className="glass-card p-6"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold">{award.name}</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {award.competition}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">{award.year}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm mb-3">
                            <span
                              className={`px-2 py-1 rounded-full ${
                                categoryBadgeClass[award.category] ||
                                "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {award.category
                                ? awardCategoryLabels[
                                    award.category as AwardCategory
                                  ] || award.category
                                : "未分类"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">获奖成员：{award.winners}</p>
                          {award.description && (
                            <p className="text-sm text-gray-500 mt-3">{award.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <Pagination
                  page={list.page}
                  pageSize={list.pageSize}
                  total={list.total}
                  totalPages={list.totalPages}
                  onPageChange={list.setPage}
                  onPageSizeChange={list.changePageSize}
                />
              </>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
