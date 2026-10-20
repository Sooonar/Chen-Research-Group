"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { usePaginatedList } from "@/lib/use-paginated-list";

interface Copyright {
  id: string;
  name: string;
  registrationNumber: string;
  version: string | null;
  registrationDate: string | null;
}

export default function CopyrightsManagementPage() {
  const {
    items: copyrights,
    total,
    page,
    pageSize,
    totalPages,
    loading,
    setPage,
    changePageSize,
    refresh,
  } = usePaginatedList<Copyright>("/api/copyrights");

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此软件著作权吗？")) return;

    try {
      const res = await fetch(`/api/copyrights/${id}`, { method: "DELETE" });
      if (res.ok) {
        refresh();
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting copyright:", error);
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
              <h1 className="text-3xl font-bold">软件著作权管理</h1>
              <p className="text-gray-400 mt-1">管理软件著作权信息</p>
            </div>
          </div>
          <Link
            href="/admin/copyrights/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加软著
          </Link>
        </div>

        {loading && copyrights.length === 0 ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : copyrights.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无软件著作权数据</p>
            <Link
              href="/admin/copyrights/new"
              className="text-blue-400 hover:underline"
            >
              添加第一个软件著作权
            </Link>
          </div>
        ) : (
          <>
            <div className={`glass-card overflow-hidden transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">名称</th>
                    <th className="text-left p-4 text-gray-400 font-medium">登记号</th>
                    <th className="text-left p-4 text-gray-400 font-medium">版本</th>
                    <th className="text-left p-4 text-gray-400 font-medium">登记日期</th>
                    <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {copyrights.map((copyright) => (
                    <tr key={copyright.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{copyright.name}</td>
                      <td className="p-4 text-gray-300 text-sm">{copyright.registrationNumber}</td>
                      <td className="p-4 text-gray-400">{copyright.version || "-"}</td>
                      <td className="p-4 text-gray-400">{copyright.registrationDate || "-"}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/copyrights/${copyright.id}/edit`}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(copyright.id)}
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
