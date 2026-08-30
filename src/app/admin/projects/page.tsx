"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  name: string;
  leader: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
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

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此项目吗？")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("删除失败");
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">项目管理</h1>
              <p className="text-gray-400 mt-1">管理科研项目</p>
            </div>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加项目
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无项目</p>
            <Link
              href="/admin/projects/new"
              className="text-blue-400 hover:underline"
            >
              添加第一个项目
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">项目名称</th>
                  <th className="text-left p-4 text-gray-400 font-medium">负责人</th>
                  <th className="text-left p-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left p-4 text-gray-400 font-medium">时间</th>
                  <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-medium">{project.name}</td>
                    <td className="p-4 text-gray-300">{project.leader}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusColorMap[project.status] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {statusMap[project.status] || project.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {project.startDate
                        ? `${new Date(project.startDate).getFullYear()}${
                            project.endDate
                              ? ` - ${new Date(project.endDate).getFullYear()}`
                              : ""
                          }`
                        : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
