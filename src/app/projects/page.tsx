"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Users, FolderOpen, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) setProjects(await res.json());
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProjects = projects.filter((project) =>
    !normalizedSearch ||
    project.name.toLowerCase().includes(normalizedSearch) ||
    project.leader.toLowerCase().includes(normalizedSearch)
  );

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

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center text-gray-400">暂无项目</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
