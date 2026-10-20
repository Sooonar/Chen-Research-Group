"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft, Upload } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string | null;
}

export default function PapersManagementPage() {
  const {
    items: papers,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    refresh,
  } = usePaginatedList<Paper>("/api/papers");

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此论文吗？")) return;

    try {
      const res = await fetch(`/api/papers/${id}`, { method: "DELETE" });
      if (res.ok) {
        refresh();
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
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
              <h1 className="text-3xl font-bold">论文管理</h1>
              <p className="text-gray-400 mt-1">管理学术论文</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              批量导入
            </button>
            <Link
              href="/admin/papers/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加论文
            </Link>
          </div>
        </div>

        {loading && papers.length === 0 ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : papers.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无论文数据</p>
            <Link
              href="/admin/papers/new"
              className="text-blue-400 hover:underline"
            >
              添加第一篇论文
            </Link>
          </div>
        ) : (
          <>
            <div className={`glass-card overflow-hidden transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">标题</th>
                    <th className="text-left p-4 text-gray-400 font-medium">作者</th>
                    <th className="text-left p-4 text-gray-400 font-medium">期刊/会议</th>
                    <th className="text-left p-4 text-gray-400 font-medium">年份</th>
                    <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map((paper) => (
                    <tr key={paper.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="max-w-md truncate font-medium">
                          {paper.title}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 text-sm max-w-xs truncate">
                        {paper.authors}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{paper.journal}</td>
                      <td className="p-4 text-gray-400">{paper.year}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/papers/${paper.id}/edit`}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(paper.id)}
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
    </div>
  );
}
