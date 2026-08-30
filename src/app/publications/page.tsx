"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Award, Code, ExternalLink, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string | null;
}

interface Patent {
  id: string;
  name: string;
  patentNumber: string;
  patentType: string;
  status: string;
  applicationDate: string | null;
  authorizationDate: string | null;
  inventors: string | null;
}

interface Copyright {
  id: string;
  name: string;
  registrationNumber: string;
  version: string | null;
  registrationDate: string | null;
  submittedBy: string | null;
}

interface AwardMember {
  name: string;
  title: string;
  userId?: string | null;
}

interface AwardRecord {
  id: string;
  name: string;
  competition: string;
  level: string;
  winners: string;
  year: number;
  description: string | null;
  imageUrl: string | null;
  submittedBy: string | null;
}

const patentTypeMap: Record<string, string> = {
  INVENTION: "发明专利",
  UTILITY: "实用新型",
  DESIGN: "外观设计",
};

const patentStatusMap: Record<string, string> = {
  APPLIED: "申请中",
  AUTHORIZED: "已授权",
};

const awardLevelMap: Record<string, string> = {
  NATIONAL_FIRST: "国家级一等奖",
  NATIONAL_SECOND: "国家级二等奖",
  NATIONAL_THIRD: "国家级三等奖",
  PROVINCIAL_FIRST: "省部级一等奖",
  PROVINCIAL_SECOND: "省部级二等奖",
  PROVINCIAL_THIRD: "省部级三等奖",
  OTHER: "其他",
};

type TabType = "papers" | "patents" | "copyrights" | "awards";
type AwardScope = "all" | "classmates" | "mine";

function PublicationsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const initialTab: TabType = queryTab === "papers" || queryTab === "patents" || queryTab === "copyrights" || queryTab === "awards" ? queryTab : "papers";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [copyrights, setCopyrights] = useState<Copyright[]>([]);
  const [awards, setAwards] = useState<AwardRecord[]>([]);
  const [members, setMembers] = useState<AwardMember[]>([]);
  const [awardScope, setAwardScope] = useState<AwardScope>("all");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [papersRes, patentsRes, copyrightsRes, awardsRes, membersRes] = await Promise.all([
          fetch("/api/papers"),
          fetch("/api/patents"),
          fetch("/api/copyrights"),
          fetch("/api/awards"),
          fetch("/api/members"),
        ]);

        if (papersRes.ok) {
          const data = await papersRes.json();
          setPapers(data);
        }
        if (patentsRes.ok) {
          const data = await patentsRes.json();
          setPatents(data);
        }
        if (copyrightsRes.ok) {
          const data = await copyrightsRes.json();
          setCopyrights(data);
        }
        if (awardsRes.ok) {
          const data = await awardsRes.json();
          setAwards(data);
        }
        if (membersRes.ok) setMembers(await membersRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (queryTab === "papers" || queryTab === "patents" || queryTab === "copyrights" || queryTab === "awards") {
      const timer = window.setTimeout(() => setActiveTab(queryTab), 0);
      return () => window.clearTimeout(timer);
    }
  }, [queryTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedYear("all");
    setSearch("");
  };

  const getYear = (value: string | null) => (value ? new Date(value).getFullYear() : null);
  const years = [...new Set(
    activeTab === "papers"
      ? papers.map((item) => item.year)
      : activeTab === "patents"
        ? patents.map((item) => getYear(item.authorizationDate || item.applicationDate)).filter((year): year is number => year !== null)
        : activeTab === "copyrights"
          ? copyrights.map((item) => getYear(item.registrationDate)).filter((year): year is number => year !== null)
          : awards.map((item) => item.year)
  )].sort((a, b) => b - a);
  const normalizedSearch = search.trim().toLowerCase();
  const matchesSearch = (values: Array<string | null | undefined>) =>
    !normalizedSearch || values.some((value) => (value || "").toLowerCase().includes(normalizedSearch));
  const matchesYear = (year: number | null) => selectedYear === "all" || year === selectedYear;

  const filteredPapers = papers.filter((paper) => matchesYear(paper.year) && matchesSearch([paper.title, paper.authors]));
  const filteredPatents = patents.filter((patent) => matchesYear(getYear(patent.authorizationDate || patent.applicationDate)) && matchesSearch([patent.name, patent.inventors]));
  const filteredCopyrights = copyrights.filter((copyright) => matchesYear(getYear(copyright.registrationDate)) && matchesSearch([copyright.name, copyright.submittedBy]));

  const currentUser = session?.user;
  const normalizeName = (value: string) =>
    value
      .replace(/[（(][^）)]*[）)]/g, "")
      .replace(/\s+/g, "")
      .replace(/老师$/, "");
  const studentNames = members
    .filter((member) => member.title !== "TEACHER")
    .map((member) => normalizeName(member.name));
  const filteredAwards = awards.filter((award) => {
    const winners = award.winners.split(/[,，、]/).map((name) => name.trim()).filter(Boolean);
    const hasClassmateWinner = winners.some((winner) => {
      const normalizedWinner = normalizeName(winner);
      return studentNames.some(
        (studentName) =>
          normalizedWinner === studentName ||
          normalizedWinner.includes(studentName) ||
          studentName.includes(normalizedWinner)
      );
    });
    const matchesScope = awardScope === "all" ||
      (awardScope === "classmates" && (!award.submittedBy || hasClassmateWinner)) ||
      (awardScope === "mine" && !!currentUser && (award.submittedBy === currentUser.id || winners.includes(currentUser.name)));
    return matchesScope && matchesYear(award.year) && matchesSearch([award.name, award.competition, award.winners]);
  });

  const tabs = [
    { id: "papers" as TabType, label: "学术论文", icon: FileText, count: papers.length },
    { id: "patents" as TabType, label: "专利", icon: Award, count: patents.length },
    { id: "copyrights" as TabType, label: "软件著作权", icon: Code, count: copyrights.length },
    { id: "awards" as TabType, label: "获奖", icon: Award, count: awards.length },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">
              <span className="gradient-text">科研成果</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              展示课题组在学术论文、专利和软件著作权方面的成果
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-400">加载中...</div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="搜索名称或作者"
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value === "all" ? "all" : Number(event.target.value))}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="按年份筛选"
                >
                  <option value="all">全部年份</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>

              {/* Papers */}
              {activeTab === "papers" && (
                <div>
                  <div className="space-y-4">
                    {filteredPapers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="glass-card p-6 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">
                              {paper.doi ? (
                                <a
                                  href={`https://doi.org/${paper.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                                >
                                  {paper.title}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                paper.title
                              )}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">
                              {paper.authors}
                            </p>
                            <p className="text-sm text-gray-500">
                              {paper.journal} • {paper.year}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-gray-600">
                            {paper.year}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patents */}
              {activeTab === "patents" && (
                <div className="space-y-4">
                  {filteredPatents.map((patent, index) => (
                    <motion.div
                      key={patent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">{patent.name}</h3>
                          <p className="text-sm text-gray-400 mb-1">
                            专利号：{patent.patentNumber}
                          </p>
                          <p className="text-sm text-gray-400 mb-1">
                            发明人：{patent.inventors}
                          </p>
                          <p className="text-sm text-gray-500">
                            申请日期：{patent.applicationDate}
                            {patent.authorizationDate &&
                              ` • 授权日期：${patent.authorizationDate}`}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              patent.patentType === "INVENTION"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {patentTypeMap[patent.patentType] || patent.patentType}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              patent.status === "AUTHORIZED"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {patentStatusMap[patent.status] || patent.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Copyrights */}
              {activeTab === "copyrights" && (
                <div className="space-y-4">
                  {filteredCopyrights.map((copyright, index) => (
                    <motion.div
                      key={copyright.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-card p-6"
                    >
                      <h3 className="font-semibold mb-2">{copyright.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>登记号：{copyright.registrationNumber}</span>
                        {copyright.version && <span>版本：{copyright.version}</span>}
                        {copyright.registrationDate && (
                          <span>登记日期：{copyright.registrationDate}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Awards */}
              {activeTab === "awards" && (
                <div>
                  <div className="flex justify-center gap-3 mb-8">
                    <button
                      onClick={() => setAwardScope("all")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        awardScope === "all"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setAwardScope("classmates")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        awardScope === "classmates"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      同学
                    </button>
                    <button
                      onClick={() => setAwardScope("mine")}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        awardScope === "mine"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      我的
                    </button>
                  </div>

                  {awardScope === "mine" && !currentUser ? (
                    <div className="glass-card p-8 text-center text-gray-400">
                      登录后查看我的获奖记录
                    </div>
                  ) : filteredAwards.length === 0 ? (
                    <div className="glass-card p-8 text-center text-gray-400">
                      暂无获奖记录
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredAwards.map((award, index) => (
                        <motion.div
                          key={award.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="glass-card p-6"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="font-semibold">{award.name}</h3>
                              <p className="text-sm text-gray-400 mt-1">{award.competition}</p>
                            </div>
                            <span className="text-sm text-gray-500">{award.year}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm mb-3">
                            <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                              {awardLevelMap[award.level] || award.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">获奖成员：{award.winners}</p>
                          {award.description && (
                            <p className="text-sm text-gray-500 mt-3">{award.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>}>
      <PublicationsContent />
    </Suspense>
  );
}
