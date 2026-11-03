"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";
import { AWARD_CATEGORIES, awardCategoryLabels } from "@/lib/award-category";

interface AwardRecord {
  id: string;
  name: string;
  competition: string;
  category: string;
  winners: string;
  year: number;
}

const categoryColorMap: Record<string, string> = {
  RESEARCH: "bg-blue-500/20 text-blue-400",
  TEACHING: "bg-purple-500/20 text-purple-400",
  COMPETITION: "bg-yellow-500/20 text-yellow-400",
  ACADEMIC: "bg-green-500/20 text-green-400",
};

export default function AwardsManagementPage() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const query = useMemo(
    () => ({ category: categoryFilter || undefined }),
    [categoryFilter]
  );
  const {
    items: awards,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    resetPage,
    refresh,
  } = usePaginatedList<AwardRecord>("/api/awards", query);

  function handleCategoryFilter(value: string) {
    setCategoryFilter(value);
    resetPage();
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此获奖记录吗？")) return;

    try {
      const res = await fetch(`/api/awards/${id}`, { method: "DELETE" });
      if (res.ok) {
        refresh();
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting award:", error);
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
              <h1 className="text-3xl font-bold">获奖管理</h1>
              <p className="text-gray-400 mt-1">管理获奖记录</p>
            </div>
          </div>
          <Link
            href="/admin/awards/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加获奖
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="按分类筛选"
          >
            <option value="">全部分类</option>
            {AWARD_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {awardCategoryLabels[category]}
              </option>
            ))}
          </select>
        </div>

        {loading && awards.length === 0 ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : awards.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无获奖记录</p>
            <Link
              href="/admin/awards/new"
              className="text-blue-400 hover:underline"
            >
              添加第一条获奖记录
            </Link>
          </div>
        ) : (
          <>
            <div className={`glass-card overflow-hidden transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">获奖名称</th>
                    <th className="text-left p-4 text-gray-400 font-medium">分类</th>
                    <th className="text-left p-4 text-gray-400 font-medium">赛事</th>
                    <th className="text-left p-4 text-gray-400 font-medium">获奖成员</th>
                    <th className="text-left p-4 text-gray-400 font-medium">年份</th>
                    <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award) => (
                    <tr key={award.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{award.name}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            categoryColorMap[award.category] || "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {award.category
                            ? awardCategoryLabels[
                                award.category as keyof typeof awardCategoryLabels
                              ] || award.category
                            : "未分类"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{award.competition}</td>
                      <td className="p-4 text-gray-400 text-sm max-w-xs truncate">
                        {award.winners}
                      </td>
                      <td className="p-4 text-gray-400">{award.year}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/awards/${award.id}/edit`}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(award.id)}
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
