"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";

interface AwardRecord {
  id: string;
  name: string;
  competition: string;
  level: string;
  winners: string;
  year: number;
}

const levelMap: Record<string, string> = {
  NATIONAL_FIRST: "国家级一等奖",
  NATIONAL_SECOND: "国家级二等奖",
  NATIONAL_THIRD: "国家级三等奖",
  PROVINCIAL_FIRST: "省部级一等奖",
  PROVINCIAL_SECOND: "省部级二等奖",
  PROVINCIAL_THIRD: "省部级三等奖",
  OTHER: "其他",
};

const levelColorMap: Record<string, string> = {
  NATIONAL_FIRST: "bg-yellow-500/20 text-yellow-400",
  NATIONAL_SECOND: "bg-orange-500/20 text-orange-400",
  NATIONAL_THIRD: "bg-amber-500/20 text-amber-400",
  PROVINCIAL_FIRST: "bg-blue-500/20 text-blue-400",
  PROVINCIAL_SECOND: "bg-indigo-500/20 text-indigo-400",
  PROVINCIAL_THIRD: "bg-purple-500/20 text-purple-400",
  OTHER: "bg-gray-500/20 text-gray-400",
};

export default function AwardsManagementPage() {
  const {
    items: awards,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    refresh,
  } = usePaginatedList<AwardRecord>("/api/awards");

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
                    <th className="text-left p-4 text-gray-400 font-medium">赛事</th>
                    <th className="text-left p-4 text-gray-400 font-medium">等级</th>
                    <th className="text-left p-4 text-gray-400 font-medium">获奖成员</th>
                    <th className="text-left p-4 text-gray-400 font-medium">年份</th>
                    <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award) => (
                    <tr key={award.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{award.name}</td>
                      <td className="p-4 text-gray-300">{award.competition}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            levelColorMap[award.level] || "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {levelMap[award.level] || award.level}
                        </span>
                      </td>
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
