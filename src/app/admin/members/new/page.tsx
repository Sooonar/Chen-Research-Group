"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { deriveGrade, getAcademicYear, gradeLabels } from "@/lib/member-grade";

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "MASTER",
    enrollmentYear: "",
    researchDirection: "",
    bio: "",
    email: "",
    displayOrder: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          enrollmentYear: form.enrollmentYear ? parseInt(form.enrollmentYear) : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/members");
      } else {
        alert("添加失败");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("添加失败");
    } finally {
      setLoading(false);
    }
  };

  const previewGrade = form.enrollmentYear ? deriveGrade(parseInt(form.enrollmentYear)) : null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/members"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">添加成员</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              姓名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              职称 <span className="text-red-400">*</span>
            </label>
            <select
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="TEACHER">老师</option>
              <option value="PHD">博士生</option>
              <option value="MASTER">硕士生</option>
              <option value="ALUMNI">已毕业</option>
            </select>
          </div>

          {(form.title === "MASTER" || form.title === "ALUMNI") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                入学年份
              </label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={form.enrollmentYear}
                onChange={(e) => setForm({ ...form, enrollmentYear: e.target.value })}
                placeholder={`如 ${getAcademicYear()}`}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <p className="mt-2 text-xs text-gray-500">
                {form.title === "ALUMNI"
                  ? "已毕业成员保留入学年份供日后查档，不参与「研几」展示"
                  : previewGrade
                    ? `按当前（${getAcademicYear()}）学年显示为「${gradeLabels[previewGrade]}」`
                    : "填写后年级由系统按学年自动推算，每年 9 月自动升一级"}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              研究方向
            </label>
            <input
              type="text"
              value={form.researchDirection}
              onChange={(e) =>
                setForm({ ...form, researchDirection: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="例如：人工智能、机器学习"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              个人简介
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              显示顺序
            </label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
            >
              {loading ? "添加中..." : "添加成员"}
            </button>
            <Link
              href="/admin/members"
              className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
