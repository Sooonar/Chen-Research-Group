"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProjectOption { id: string; name: string }

const initialForm = {
  name: "", organizer: "", year: new Date().getFullYear().toString(), result: "WON",
  participants: "", awardLevel: "OTHER", description: "", imageUrl: "", projectId: "",
};

export default function NewCompetitionPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects").then((res) => res.ok ? res.json() : []).then(setProjects).catch(() => setProjects([]));
  }, []);

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/competitions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) router.push("/admin/competitions");
      else alert("添加失败");
    } catch { alert("添加失败"); } finally { setLoading(false); }
  }

  return <div className="min-h-screen py-8"><div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center gap-4 mb-8"><Link href="/admin/competitions" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-3xl font-bold">添加竞赛</h1></div>
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <div><label className="field-label">竞赛名称 <Required /></label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" placeholder="例如：全国大学生数学建模竞赛" /></div>
      <div><label className="field-label">主办方 <Required /></label><input required value={form.organizer} onChange={(e) => update("organizer", e.target.value)} className="field-input" /></div>
      <div className="grid grid-cols-2 gap-4"><div><label className="field-label">年份 <Required /></label><input required type="number" value={form.year} onChange={(e) => update("year", e.target.value)} className="field-input" /></div><div><label className="field-label">结果 <Required /></label><select value={form.result} onChange={(e) => update("result", e.target.value)} className="field-input"><option value="WON">获奖</option><option value="NOT_WON">未获奖</option></select></div></div>
      <div><label className="field-label">参赛成员 <Required /></label><input required value={form.participants} onChange={(e) => update("participants", e.target.value)} className="field-input" placeholder="用逗号分隔多位成员" /></div>
      {form.result === "WON" && <div><label className="field-label">获奖等级</label><select value={form.awardLevel} onChange={(e) => update("awardLevel", e.target.value)} className="field-input"><option value="NATIONAL_FIRST">国家级一等奖</option><option value="NATIONAL_SECOND">国家级二等奖</option><option value="NATIONAL_THIRD">国家级三等奖</option><option value="PROVINCIAL_FIRST">省部级一等奖</option><option value="PROVINCIAL_SECOND">省部级二等奖</option><option value="PROVINCIAL_THIRD">省部级三等奖</option><option value="OTHER">其他</option></select><p className="text-xs text-gray-500 mt-2">保存获奖竞赛时，会自动生成一条获奖记录。</p></div>}
      <div><label className="field-label">关联项目</label><select value={form.projectId} onChange={(e) => update("projectId", e.target.value)} className="field-input"><option value="">不关联项目</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div>
      <div><label className="field-label">竞赛说明</label><textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="field-input resize-none" /></div>
      <div><label className="field-label">图片 URL</label><input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} className="field-input" /></div>
      <div className="flex gap-4 pt-2"><button disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">{loading ? "添加中..." : "添加竞赛"}</button><Link href="/admin/competitions" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg">取消</Link></div>
    </form>
  </div></div>;
}

function Required() { return <span className="text-red-400">*</span>; }
