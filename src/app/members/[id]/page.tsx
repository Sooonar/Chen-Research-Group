"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { gradeLabels } from "@/lib/member-grade";

interface Member {
  id: string;
  name: string;
  title: string;
  grade: number | null;
  enrollmentYear: number | null;
  studentNo: string | null;
  phone: string | null;
  department: string | null;
  major: string | null;
  programType: string | null;
  thesisTitle: string | null;
  researchDirection: string | null;
  bio: string | null;
  email: string | null;
  avatarUrl: string | null;
  publications?: Array<{
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi: string | null;
  }>;
}

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  PHD: "博士生",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/members/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMember(data);
        }
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
            加载中...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!member) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">未找到该成员</p>
            <Link href="/members" className="text-blue-400 hover:underline">
              返回成员列表
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回成员列表
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Member header */}
            <div className="glass-card p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
                  <p className="text-blue-400 text-lg mb-4">
                    {titleMap[member.title] || member.title}
                    {member.title === "MASTER" && member.grade
                      ? `（${gradeLabels[member.grade]}）`
                      : ""}
                  </p>
                  <p className="text-gray-300 mb-4">
                    {member.researchDirection}
                  </p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 学籍信息：由 bio 拆出的结构化字段 */}
            {(member.department ||
              member.major ||
              member.programType ||
              member.studentNo ||
              member.enrollmentYear ||
              member.thesisTitle) && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  学籍信息
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  {member.department && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">院系</dt>
                      <dd className="text-gray-300">{member.department}</dd>
                    </div>
                  )}
                  {member.major && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">专业</dt>
                      <dd className="text-gray-300">{member.major}</dd>
                    </div>
                  )}
                  {member.programType && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">学生类别</dt>
                      <dd className="text-gray-300">{member.programType}</dd>
                    </div>
                  )}
                  {member.enrollmentYear && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">入学年份</dt>
                      <dd className="text-gray-300">{member.enrollmentYear} 年</dd>
                    </div>
                  )}
                  {member.studentNo && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 shrink-0">学号</dt>
                      <dd className="text-gray-300">{member.studentNo}</dd>
                    </div>
                  )}
                  {member.thesisTitle && (
                    <div className="flex gap-2 sm:col-span-2">
                      <dt className="text-gray-500 shrink-0">论文题目</dt>
                      <dd className="text-gray-300">{member.thesisTitle}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Bio：字段拆分后，纯档案格式的旧文本不再重复展示 */}
            {member.bio && !/^院系[：:]/.test(member.bio.trim()) && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  个人简介
                </h2>
                <p className="text-gray-300 leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Papers */}
            {member.publications && member.publications.length > 0 && (
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  发表论文
                </h2>
                <div className="space-y-4">
                  {member.publications.map((paper) => (
                    <div
                      key={paper.id}
                      className="border-l-2 border-blue-500/30 pl-4 py-2"
                    >
                      <h3 className="font-medium mb-1">
                        {paper.doi ? (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors"
                          >
                            {paper.title}
                          </a>
                        ) : (
                          paper.title
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {paper.authors} - {paper.journal}, {paper.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
