"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Award, Code, Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  AWARD_CATEGORIES,
  awardCategoryLabels,
} from "@/lib/award-category";

const submissionTypes = [
  { id: "PUBLICATION", label: "论文", icon: FileText, description: "学术论文、期刊文章" },
  { id: "PATENT", label: "专利", icon: Award, description: "发明专利、实用新型" },
  { id: "COPYRIGHT", label: "软件著作权", icon: Code, description: "软件著作权登记" },
  { id: "AWARD", label: "获奖", icon: Trophy, description: "科研/教学/竞赛/学业获奖" },
];

export default function NewSubmissionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [form, setForm] = useState<any>({});

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setForm({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          data: form,
        }),
      });

      if (res.ok) {
        router.push("/profile/submissions");
      } else {
        const data = await res.json();
        alert(data.error || "提交失败");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("提交失败");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case "PUBLICATION":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                论文标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                作者 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.authors || ""}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="用逗号分隔多位作者"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  期刊/会议 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.journal || ""}
                  onChange={(e) => setForm({ ...form, journal: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  年份 <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={form.year || ""}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">DOI</label>
              <input
                type="text"
                value={form.doi || ""}
                onChange={(e) => setForm({ ...form, doi: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">摘要</label>
              <textarea
                value={form.abstract || ""}
                onChange={(e) => setForm({ ...form, abstract: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              />
            </div>
          </>
        );

      case "PATENT":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                专利名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                专利号 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.patentNumber || ""}
                onChange={(e) => setForm({ ...form, patentNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  类型 <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.patentType || "INVENTION"}
                  onChange={(e) => setForm({ ...form, patentType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="INVENTION">发明专利</option>
                  <option value="UTILITY">实用新型</option>
                  <option value="DESIGN">外观设计</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  状态
                </label>
                <select
                  value={form.status || "APPLIED"}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="APPLIED">申请中</option>
                  <option value="AUTHORIZED">已授权</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                发明人 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.inventors || ""}
                onChange={(e) => setForm({ ...form, inventors: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="用逗号分隔多位发明人"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">申请日期</label>
                <input
                  type="date"
                  value={form.applicationDate || ""}
                  onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">授权日期</label>
                <input
                  type="date"
                  value={form.authorizationDate || ""}
                  onChange={(e) => setForm({ ...form, authorizationDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
          </>
        );

      case "COPYRIGHT":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                软件名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                登记号 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.registrationNumber || ""}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">版本</label>
                <input
                  type="text"
                  value={form.version || ""}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="例如：V1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">登记日期</label>
                <input
                  type="date"
                  value={form.registrationDate || ""}
                  onChange={(e) => setForm({ ...form, registrationDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
          </>
        );

      case "AWARD":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                获奖分类 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category || "RESEARCH"}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                {AWARD_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {awardCategoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                获奖名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                赛事/评奖机构 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.competition || ""}
                onChange={(e) => setForm({ ...form, competition: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                获奖年份 <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.year || ""}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                获奖成员 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.winners || ""}
                onChange={(e) => setForm({ ...form, winners: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="用逗号分隔多位成员"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">获奖说明</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/profile/submissions"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">提交新成果</h1>
          </div>

          {/* Type selection */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">选择成果类型</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {submissionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedType === type.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <type.icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedType === type.id ? "text-blue-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-medium ${
                      selectedType === type.id ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          {selectedType && (
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
              {renderForm()}

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                >
                  {loading ? "提交中..." : "提交审核"}
                </button>
                <Link
                  href="/profile/submissions"
                  className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  取消
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
