"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Member {
  id: string;
  name: string;
  title: string;
  researchDirection: string | null;
  email: string | null;
  avatarUrl: string | null;
  displayOrder: number;
}

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  PHD: "博士生",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此成员吗？")) return;

    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers(members.filter((m) => m.id !== id));
      } else {
        alert("删除失败");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
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
              <h1 className="text-3xl font-bold">成员管理</h1>
              <p className="text-gray-400 mt-1">管理团队成员信息</p>
            </div>
          </div>
          <Link
            href="/admin/members/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加成员
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : members.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 mb-4">暂无成员数据</p>
            <Link
              href="/admin/members/new"
              className="text-blue-400 hover:underline"
            >
              添加第一位成员
            </Link>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">姓名</th>
                  <th className="text-left p-4 text-gray-400 font-medium">职称</th>
                  <th className="text-left p-4 text-gray-400 font-medium">研究方向</th>
                  <th className="text-left p-4 text-gray-400 font-medium">邮箱</th>
                  <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold overflow-hidden">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            member.name[0]
                          )}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{titleMap[member.title] || member.title}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {member.researchDirection || "-"}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {member.email || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/members/${member.id}/edit`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
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
