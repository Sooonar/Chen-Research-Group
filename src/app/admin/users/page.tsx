"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Shield, Trash2, UserCheck, UserX, RefreshCw } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  role: string;
  status: string;
  createdAt: string;
}

const roleMap: Record<string, string> = {
  SUPER_ADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "普通成员",
};

const roleColorMap: Record<string, string> = {
  SUPER_ADMIN: "bg-yellow-500/20 text-yellow-400",
  ADMIN: "bg-purple-500/20 text-purple-400",
  MEMBER: "bg-blue-500/20 text-blue-400",
};

const statusMap: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

const statusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: "APPROVED" } : u)));
      } else {
        alert("操作失败");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      alert("操作失败");
    }
  }

  async function handleReject(id: string) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u)));
      } else {
        alert("操作失败");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("操作失败");
    }
  }

  async function handleRoleChange(id: string, newRole: string) {
    if (!confirm(`确定要将该用户角色更改为 ${roleMap[newRole]} 吗？`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      } else {
        const data = await res.json();
        alert(data.error || "操作失败");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("操作失败");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除此用户吗？此操作不可撤销。")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "删除失败");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("删除失败");
    }
  }

  async function handleSync() {
    if (!confirm("确定要为所有已审核用户创建成员记录吗？")) return;

    setSyncing(true);
    try {
      const res = await fetch("/api/users/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
      } else {
        const data = await res.json();
        alert(data.error || "同步失败");
      }
    } catch (error) {
      console.error("Error syncing users:", error);
      alert("同步失败");
    } finally {
      setSyncing(false);
    }
  }

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.status === filter);

  const pendingCount = users.filter((u) => u.status === "PENDING").length;

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
              <h1 className="text-3xl font-bold">用户管理</h1>
              <p className="text-gray-400 mt-1">
                管理注册用户，审核新成员
                {pendingCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    {pendingCount} 人待审核
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "同步中..." : "同步成员"}
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            全部 ({users.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === "PENDING"
                ? "bg-yellow-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            待审核 ({users.filter((u) => u.status === "PENDING").length})
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === "APPROVED"
                ? "bg-green-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            已通过 ({users.filter((u) => u.status === "APPROVED").length})
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            已拒绝 ({users.filter((u) => u.status === "REJECTED").length})
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400">暂无用户数据</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">用户</th>
                  <th className="text-left p-4 text-gray-400 font-medium">学号/工号</th>
                  <th className="text-left p-4 text-gray-400 font-medium">角色</th>
                  <th className="text-left p-4 text-gray-400 font-medium">状态</th>
                  <th className="text-left p-4 text-gray-400 font-medium">注册时间</th>
                  <th className="text-right p-4 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-white/5 hover:bg-white/5 ${
                      user.status === "PENDING" ? "bg-yellow-500/5" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {user.studentId || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          roleColorMap[user.role] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {roleMap[user.role] || user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          statusColorMap[user.status] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {statusMap[user.status] || user.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* 审核按钮 */}
                        {user.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="通过"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="拒绝"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* 角色修改（仅超级管理员可见） */}
                        {user.status === "APPROVED" && (
                          <div className="relative group">
                            <button
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="修改角色"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              {user.role !== "MEMBER" && (
                                <button
                                  onClick={() => handleRoleChange(user.id, "MEMBER")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-t-lg"
                                >
                                  设为普通成员
                                </button>
                              )}
                              {user.role !== "ADMIN" && (
                                <button
                                  onClick={() => handleRoleChange(user.id, "ADMIN")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                                >
                                  设为管理员
                                </button>
                              )}
                              {user.role !== "SUPER_ADMIN" && (
                                <button
                                  onClick={() => handleRoleChange(user.id, "SUPER_ADMIN")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-b-lg"
                                >
                                  设为超级管理员
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 删除按钮 */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="删除"
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
