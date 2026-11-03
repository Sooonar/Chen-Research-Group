"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Award, Code, ExternalLink, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";
import type { PageResult } from "@/lib/pagination";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string | null;
}

interface Patent {
  id: string;
  name: string;
  patentNumber: string;
  patentType: string;
  status: string;
  applicationDate: string | null;
  authorizationDate: string | null;
  inventors: string | null;
}

interface Copyright {
  id: string;
  name: string;
  registrationNumber: string;
  version: string | null;
  registrationDate: string | null;
  submittedBy: string | null;
}

type PublicationItem = Paper | Patent | Copyright;

const patentTypeMap: Record<string, string> = {
  INVENTION: "发明专利",
  UTILITY: "实用新型",
  DESIGN: "外观设计",
};

const patentStatusMap: Record<string, string> = {
  APPLIED: "申请中",
  AUTHORIZED: "已授权",
};

type TabType = "papers" | "patents" | "copyrights";

const TAB_ENDPOINTS: Record<TabType, string> = {
  papers: "/api/papers",
  patents: "/api/patents",
  copyrights: "/api/copyrights",
};

const TAB_ORDER: TabType[] = ["papers", "patents", "copyrights"];

function PublicationsContent() {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const initialTab: TabType =
    queryTab === "papers" || queryTab === "patents" || queryTab === "copyrights"
      ? queryTab
      : "papers";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [counts, setCounts] = useState<Record<TabType, number>>({
    papers: 0,
    patents: 0,
    copyrights: 0,
  });

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      year: selectedYear === "all" ? undefined : selectedYear,
    }),
    [debouncedSearch, selectedYear]
  );

  const list = usePaginatedList<PublicationItem>(TAB_ENDPOINTS[activeTab], query);
  const { resetPage } = list;

  // 标签页上的数量始终展示各分类的总数，不随当前搜索条件变化。
  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      const entries = await Promise.all(
        TAB_ORDER.map(async (tab) => {
          try {
            const res = await fetch(`${TAB_ENDPOINTS[tab]}?page=1&pageSize=1`, {
              cache: "no-store",
            });
            if (!res.ok) return [tab, 0] as const;
            const data = (await res.json()) as PageResult<unknown>;
            return [tab, data.total ?? 0] as const;
          } catch {
            return [tab, 0] as const;
          }
        })
      );
      if (!cancelled) {
        setCounts(Object.fromEntries(entries) as Record<TabType, number>);
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

  useEffect(() => {
    if (
      queryTab === "papers" ||
      queryTab === "patents" ||
      queryTab === "copyrights"
    ) {
      const timer = window.setTimeout(() => {
        setActiveTab(queryTab);
        setSelectedYear("all");
        setSearch("");
        setDebouncedSearch("");
        resetPage();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [queryTab, resetPage]);

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setSelectedYear("all");
    setSearch("");
    setDebouncedSearch("");
    resetPage();
  };

  const years = list.years;
  const papers = list.items as Paper[];
  const patents = list.items as Patent[];
  const copyrights = list.items as Copyright[];

  const tabs = [
    { id: "papers" as TabType, label: "学术论文", icon: FileText, count: counts.papers },
    { id: "patents" as TabType, label: "专利", icon: Award, count: counts.patents },
    { id: "copyrights" as TabType, label: "软件著作权", icon: Code, count: counts.copyrights },
  ];

  const loadingInitial = list.loading && list.items.length === 0;

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
              <span className="gradient-text">科研成果</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              展示课题组在学术论文、专利和软件著作权方面的成果
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="搜索名称或作者"
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
                  {years.map((year) => (
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
                {/* Papers */}
                {activeTab === "papers" &&
                  (papers.length === 0 ? (
                    <div className="glass-card p-10 text-center text-gray-400">暂无学术论文</div>
                  ) : (
                    <div className="space-y-4">
                      {papers.map((paper, index) => (
                        <motion.div
                          key={paper.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index, 9) * 0.05 }}
                          className="glass-card p-6 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">
                                {paper.doi ? (
                                  <a
                                    href={`https://doi.org/${paper.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                                  >
                                    {paper.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  paper.title
                                )}
                              </h3>
                              <p className="text-sm text-gray-400 mb-1">{paper.authors}</p>
                              <p className="text-sm text-gray-500">
                                {paper.journal} • {paper.year}
                              </p>
                            </div>
                            <span className="text-2xl font-bold text-gray-600">
                              {paper.year}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}

                {/* Patents */}
                {activeTab === "patents" &&
                  (patents.length === 0 ? (
                    <div className="glass-card p-10 text-center text-gray-400">暂无专利</div>
                  ) : (
                    <div className="space-y-4">
                      {patents.map((patent, index) => (
                        <motion.div
                          key={patent.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index, 9) * 0.05 }}
                          className="glass-card p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">{patent.name}</h3>
                              <p className="text-sm text-gray-400 mb-1">
                                专利号：{patent.patentNumber}
                              </p>
                              <p className="text-sm text-gray-400 mb-1">
                                发明人：{patent.inventors}
                              </p>
                              <p className="text-sm text-gray-500">
                                申请日期：{patent.applicationDate}
                                {patent.authorizationDate &&
                                  ` • 授权日期：${patent.authorizationDate}`}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  patent.patentType === "INVENTION"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {patentTypeMap[patent.patentType] || patent.patentType}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  patent.status === "AUTHORIZED"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {patentStatusMap[patent.status] || patent.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}

                {/* Copyrights */}
                {activeTab === "copyrights" &&
                  (copyrights.length === 0 ? (
                    <div className="glass-card p-10 text-center text-gray-400">
                      暂无软件著作权
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {copyrights.map((copyright, index) => (
                        <motion.div
                          key={copyright.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index, 9) * 0.05 }}
                          className="glass-card p-6"
                        >
                          <h3 className="font-semibold mb-2">{copyright.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span>登记号：{copyright.registrationNumber}</span>
                            {copyright.version && <span>版本：{copyright.version}</span>}
                            {copyright.registrationDate && (
                              <span>登记日期：{copyright.registrationDate}</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}

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

export default function PublicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>
      }
    >
      <PublicationsContent />
    </Suspense>
  );
}
