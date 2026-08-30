"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProjectOption { id: string; name: string }
interface CompetitionForm {
  name: string; organizer: string; year: string; result: string; participants: string;
  awardLevel: string; description: string; imageUrl: string; projectId: string;
}

export default function EditCompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CompetitionForm>({ name: "", organizer: "", year: "", result: "WON", participants: "", awardLevel: "OTHER", description: "", imageUrl: "", projectId: "" });

  useEffect(() => {
    Promise.all([fetch("/api/projects"), fetch(`/api/competitions/${id}`)])
      .then(async ([projectsRes, competitionRes]) => {
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (competitionRes.ok) {
          const data = await competitionRes.json();
          setForm({ name: data.name || "", organizer: data.organizer || "", year: String(data.year || ""), result: data.result || "WON", participants: data.participants || "", awardLevel: data.awardLevel || data.award?.level || "OTHER", description: data.description || "", imageUrl: data.imageUrl || "", projectId: data.projectId || "" });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const update = (key: keyof CompetitionForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/competitions/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) router.push("/admin/competitions");
      else alert("保存失败");
    } catch { alert("保存失败"); } finally { setSaving(false); }
  }

  if (loading) return <div className="min-h-screen py-8 text-center text-gray-400">加载中...</div>;
  return <div className="min-h-screen py-8"><div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center gap-4 mb-8"><Link href="/admin/competitions" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link><h1 className="text-3xl font-bold">编辑竞赛</h1></div>
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <div><label className="field-label">竞赛名称 <Required /></label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" /></div>
      <div><label className="field-label">主办方 <Required /></label><input required value={form.organizer} onChange={(e) => update("organizer", e.target.value)} className="field-input" /></div>
      <div className="grid grid-cols-2 gap-4"><div><label className="field-label">年份 <Required /></label><input required type="number" value={form.year} onChange={(e) => update("year", e.target.value)} className="field-input" /></div><div><label className="field-label">结果 <Required /></label><select value={form.result} onChange={(e) => update("result", e.target.value)} className="field-input"><option value="WON">获奖</option><option value="NOT_WON">未获奖</option></select></div></div>
      <div><label className="field-label">参赛成员 <Required /></label><input required value={form.participants} onChange={(e) => update("participants", e.target.value)} className="field-input" /></div>
      {form.result === "WON" && <div><label className="field-label">获奖等级</label><select value={form.awardLevel} onChange={(e) => update("awardLevel", e.target.value)} className="field-input"><option value="NATIONAL_FIRST">国家级一等奖</option><option value="NATIONAL_SECOND">国家级二等奖</option><option value="NATIONAL_THIRD">国家级三等奖</option><option value="PROVINCIAL_FIRST">省部级一等奖</option><option value="PROVINCIAL_SECOND">省部级二等奖</option><option value="PROVINCIAL_THIRD">省部级三等奖</option><option value="OTHER">其他</option></select><p className="text-xs text-gray-500 mt-2">改为未获奖时，会删除该竞赛自动同步的获奖记录。</p></div>}
      <div><label className="field-label">关联项目</label><select value={form.projectId} onChange={(e) => update("projectId", e.target.value)} className="field-input"><option value="">不关联项目</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></div>
      <div><label className="field-label">竞赛说明</label><textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="field-input resize-none" /></div>
      <div><label className="field-label">图片 URL</label><input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} className="field-input" /></div>
      <div className="flex gap-4 pt-2"><button disabled={saving} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg">{saving ? "保存中..." : "保存修改"}</button><Link href="/admin/competitions" className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg">取消</Link></div>
    </form>
  </div></div>;
}

function Required() { return <span className="text-red-400">*</span>; }
