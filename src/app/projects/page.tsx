"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Users, FolderOpen, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";

interface Project {
  id: string;
  name: string;
  leader: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  members: Array<{
    member: {
      name: string;
    };
  }>;
}

const statusMap: Record<string, string> = {
  COMPLETED: "结题",
  APPROVED: "获准",
  APPLIED: "申请",
  ONGOING: "申请",
  SUSPENDED: "申请",
};

const statusColorMap: Record<string, string> = {
  APPLIED: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-500/20 text-green-400",
  COMPLETED: "bg-blue-500/20 text-blue-400",
  ONGOING: "bg-yellow-500/20 text-yellow-400",
  SUSPENDED: "bg-yellow-500/20 text-yellow-400",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    items: projects,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    resetPage,
  } = usePaginatedList<Project>("/api/projects", {
    search: debouncedSearch || undefined,
  });

  // 输入停止 300ms 后再查询。
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      resetPage();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, resetPage]);

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
              <span className="gradient-text">科研项目</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              展示课题组承担的各类科研项目
            </p>
          </motion.div>

          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索项目名称或负责人"
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading && projects.length === 0 ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-400">
              {debouncedSearch ? "没有找到符合条件的项目" : "暂无项目"}
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${
                  loading ? "opacity-60" : "opacity-100"
                }`}
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index, 9) * 0.05 }}
                  >
                    <Link href={`/projects/${project.id}`}>
                      <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold hover:text-blue-400 transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                负责人：{project.leader}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              statusColorMap[project.status] || "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {statusMap[project.status] || project.status}
                          </span>
                        </div>

                        {project.description && (
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {project.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(project.startDate).getFullYear()}
                              {project.endDate &&
                                ` - ${new Date(project.endDate).getFullYear()}`}
                            </span>
                          )}
                          {project.members.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {project.members.length} 人
                            </span>
                          )}
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
