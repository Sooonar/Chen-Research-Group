"use client";

import Link from "next/link";
import { ArrowLeft, Medal, Pencil, Plus, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";

interface Competition {
  id: string;
  name: string;
  organizer: string;
  year: number;
  result: "WON" | "NOT_WON";
  participants: string;
  project: { id: string; name: string } | null;
  award: { id: string; name: string } | null;
}

export default function CompetitionsManagementPage() {
  const {
    items: competitions,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    refresh,
  } = usePaginatedList<Competition>("/api/competitions");

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此竞赛记录吗？")) return;
    const res = await fetch(`/api/competitions/${id}`, { method: "DELETE" });
    if (res.ok) refresh();
    else alert("删除失败");
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-3xl font-bold">竞赛管理</h1>
              <p className="text-gray-400 mt-1">获奖竞赛会自动同步到获奖模块</p>
            </div>
          </div>
          <Link href="/admin/competitions/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            <Plus className="w-4 h-4" /> 添加竞赛
          </Link>
        </div>

        {loading && competitions.length === 0 ? <div className="text-center text-gray-400">加载中...</div> : competitions.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">暂无竞赛记录</div>
        ) : (
          <>
            <div className={`glass-card overflow-hidden transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">竞赛</th>
                    <th className="text-left p-4 text-gray-400 font-medium">年份</th>
                    <th className="text-left p-4 text-gray-400 font-medium">结果</th>
                    <th className="text-left p-4 text-gray-400 font-medium">所属项目</th>
                    <th className="text-left p-4 text-gray-400 font-medium">获奖同步</th>
                    <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                  </tr></thead>
                  <tbody>{competitions.map((competition) => (
                    <tr key={competition.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4"><div className="flex items-center gap-3"><Medal className="w-5 h-5 text-yellow-400" /><div><p className="font-medium">{competition.name}</p><p className="text-sm text-gray-500">{competition.organizer}</p></div></div></td>
                      <td className="p-4 text-gray-300">{competition.year}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${competition.result === "WON" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{competition.result === "WON" ? "获奖" : "未获奖"}</span></td>
                      <td className="p-4 text-gray-300">{competition.project?.name || "未关联项目"}</td>
                      <td className="p-4 text-sm text-gray-400">{competition.award ? "已同步" : "-"}</td>
                      <td className="p-4 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/competitions/${competition.id}/edit`} className="p-2 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></Link><button onClick={() => handleDelete(competition.id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
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
