"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface SiteConfigItem {
  key: string;
  label: string;
  value: string;
  type: "text" | "textarea";
}

const defaultConfigs: SiteConfigItem[] = [
  { key: "lab_name", label: "课题组名称", value: "数智管网・建科新能", type: "text" },
  { key: "lab_short_name", label: "导航栏简称（留空则取课题组名称中「・」前的一段）", value: "数智管网", type: "text" },
  { key: "lab_subtitle", label: "副标题", value: "致力于前沿科学研究，推动技术创新与突破", type: "text" },
  { key: "lab_description", label: "课题组简介", value: "我们专注于人工智能、机器学习、计算机视觉等领域的研究工作，在顶级期刊和会议上发表了多篇高水平论文，培养了一批优秀的研究生人才。", type: "textarea" },
  { key: "admission_info", label: "招生信息", value: "课题组常年招收对科研充满热情的博士研究生和硕士研究生。我们提供良好的科研环境、充足的研究经费和丰富的学术交流机会。", type: "textarea" },
  { key: "contact_email", label: "联系邮箱", value: "contact@example.com", type: "text" },
];

export default function SettingsPage() {
  const [configs, setConfigs] = useState<SiteConfigItem[]>(defaultConfigs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  async function fetchConfigs() {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const updatedConfigs = defaultConfigs.map((config) => {
            const saved = data.find((d: { key: string; value: string }) => d.key === config.key);
            return saved ? { ...config, value: saved.value } : config;
          });
          setConfigs(updatedConfigs);
        }
      }
    } catch (error) {
      console.error("Error fetching configs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      const settings = configs.map((config) => ({
        key: config.key,
        value: config.value,
      }));

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        alert("保存成功");
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Error saving configs:", error);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (key: string, value: string) => {
    setConfigs(configs.map((c) => (c.key === key ? { ...c, value } : c)));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">网站设置</h1>
              <p className="text-gray-400 mt-1">编辑首页展示内容</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : (
          <div className="glass-card p-6 space-y-6">
            {configs.map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {config.label}
                </label>
                {config.type === "text" ? (
                  <input
                    type="text"
                    value={config.value}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  <textarea
                    value={config.value}
                    onChange={(e) => handleChange(config.key, e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
