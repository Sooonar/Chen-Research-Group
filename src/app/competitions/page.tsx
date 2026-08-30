"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Medal, Trophy } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Competition {
  id: string;
  name: string;
  organizer: string;
  year: number;
  result: "WON" | "NOT_WON";
  participants: string;
  description: string | null;
  project: { id: string; name: string } | null;
  award: { id: string; name: string; level: string } | null;
}

type Filter = "all" | "WON" | "NOT_WON";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/competitions")
      .then((res) => (res.ok ? res.json() : []))
      .then(setCompetitions)
      .catch(() => setCompetitions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? competitions : competitions.filter((item) => item.result === filter);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-center mb-4"><span className="gradient-text">竞赛</span></h1>
            <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">展示课题组参与的竞赛及结果</p>
          </motion.div>

          <div className="flex justify-center gap-3 mb-10">
            {[
              { value: "all" as const, label: "全部" },
              { value: "WON" as const, label: "获奖" },
              { value: "NOT_WON" as const, label: "未获奖" },
            ].map((item) => (
              <button key={item.value} onClick={() => setFilter(item.value)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === item.value ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                {item.label}
              </button>
            ))}
          </div>

          {loading ? <div className="text-center text-gray-400">加载中...</div> : filtered.length === 0 ? <div className="glass-card p-10 text-center text-gray-400">暂无竞赛记录</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((competition, index) => (
                <motion.article key={competition.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="glass-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${competition.result === "WON" ? "bg-yellow-500/20" : "bg-white/10"}`}>
                        {competition.result === "WON" ? <Trophy className="w-5 h-5 text-yellow-400" /> : <Medal className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div><h2 className="font-semibold">{competition.name}</h2><p className="text-sm text-gray-400">{competition.organizer}</p></div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${competition.result === "WON" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{competition.result === "WON" ? "获奖" : "未获奖"}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400"><span>{competition.year} 年</span>{competition.project && <span>所属项目：{competition.project.name}</span>}</div>
                  <p className="text-sm text-gray-500 mt-3">参赛成员：{competition.participants}</p>
                  {competition.award && <p className="text-sm text-yellow-400/80 mt-2">已同步至获奖模块</p>}
                  {competition.description && <p className="text-sm text-gray-500 mt-3">{competition.description}</p>}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
