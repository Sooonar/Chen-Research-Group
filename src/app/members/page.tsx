"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";
import { Search } from "lucide-react";

interface Member {
  id: string;
  name: string;
  title: string;
  grade: number | null;
  researchDirection: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

const gradeMap: Record<number, string> = {
  1: "研一",
  2: "研二",
  3: "研三",
};

function getMemberTitle(member: Member): string {
  const title = titleMap[member.title] || member.title;
  if (member.title === "MASTER" && member.grade) {
    return `${title} (${gradeMap[member.grade] || `研${member.grade}`})`;
  }
  return title;
}

export default function MembersPage() {
  const [filter, setFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    items: members,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    resetPage,
  } = usePaginatedList<Member>("/api/members", {
    title: filter === "all" ? undefined : filter,
    grade: gradeFilter === "all" ? undefined : gradeFilter,
    search: debouncedSearch || undefined,
  });

  // 输入停止 300ms 后再发起查询，避免每敲一个字都请求一次。
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      resetPage();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, resetPage]);

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter);
    if (nextFilter === "TEACHER") {
      setSearch("");
      setDebouncedSearch("");
      setGradeFilter("all");
    }
    if (nextFilter === "ALUMNI") setGradeFilter("all");
    resetPage();
  };

  const hasFilters = filter !== "all" || gradeFilter !== "all" || debouncedSearch !== "";
  const titleGroups = ["TEACHER", "MASTER", "ALUMNI"];

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
              <span className="gradient-text">团队成员</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              我们的团队由经验丰富的导师和充满活力的研究生组成
            </p>
          </motion.div>

          {/* Filter buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              全部
            </button>
            {titleGroups.map((title) => (
              <button
                key={title}
                onClick={() => handleFilterChange(title)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === title
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {titleMap[title]}
              </button>
            ))}
          </div>

          {filter !== "TEACHER" && (
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索姓名或专业"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {filter === "MASTER" && (
                <select
                  value={gradeFilter}
                  onChange={(event) => {
                    setGradeFilter(
                      event.target.value === "all" ? "all" : Number(event.target.value)
                    );
                    resetPage();
                  }}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="按年级筛选"
                >
                  <option value="all">全部年级</option>
                  <option value="1">研一</option>
                  <option value="2">研二</option>
                  <option value="3">研三</option>
                </select>
              )}
            </div>
          )}

          {loading && members.length === 0 ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : members.length === 0 ? (
            <div className="glass-card p-10 text-center text-gray-400">
              {hasFilters ? "没有找到符合条件的成员" : "暂无成员数据"}
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
                  loading ? "opacity-60" : "opacity-100"
                }`}
              >
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index, 9) * 0.05 }}
                  >
                    <Link href={`/members/${member.id}`}>
                      <div className="glass-card p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer group h-full">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-xl font-bold text-white">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              member.name[0]
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-sm text-blue-400 mb-2">
                              {getMemberTitle(member)}
                            </p>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {member.researchDirection}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={changePageSize}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
