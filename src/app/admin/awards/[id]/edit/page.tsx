"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AWARD_CATEGORIES, awardCategoryLabels } from "@/lib/award-category";

export default function EditAwardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    competition: "",
    category: "RESEARCH",
    winners: "",
    year: new Date().getFullYear().toString(),
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function fetchAward() {
      try {
        const res = await fetch(`/api/awards/${id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            competition: data.competition || "",
            category: data.category || "RESEARCH",
            winners: data.winners || "",
            year: data.year?.toString() || new Date().getFullYear().toString(),
            description: data.description || "",
            imageUrl: data.imageUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching award:", error);
      } finally {
        setFetching(false);
      }
    }

    fetchAward();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/awards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/awards");
      } else {
        alert("更新失败");
      }
    } catch (error) {
      console.error("Error updating award:", error);
      alert("更新失败");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 text-center text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/awards" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold">编辑获奖记录</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">获奖分类</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
              {AWARD_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {awardCategoryLabels[category]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">获奖名称 <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">赛事/评奖机构 <span className="text-red-400">*</span></label>
            <input type="text" value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">年份</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">获奖成员</label>
            <input type="text" value={form.winners} onChange={(e) => setForm({ ...form, winners: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">说明</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none" />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors">
              {loading ? "保存中..." : "保存修改"}
            </button>
            <Link href="/admin/awards" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">取消</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
