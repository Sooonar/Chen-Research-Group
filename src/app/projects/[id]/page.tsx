"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, FileText, Award, Code } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Project {
  id: string;
  name: string;
  leader: string;
  fundingSource: string | null;
  fundingAmount: number | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  description: string | null;
  members: Array<{
    member: {
      id: string;
      name: string;
      title: string;
      avatarUrl: string | null;
    };
    role: string | null;
  }>;
  progress: Array<{
    id: string;
    title: string;
    content: string;
    progressDate: string;
  }>;
  publications: Array<{
    publication: {
      id: string;
      title: string;
      year: number;
    };
  }>;
  patents: Array<{
    patent: {
      id: string;
      name: string;
    };
  }>;
  copyrights: Array<{
    copyright: {
      id: string;
      name: string;
    };
  }>;
  awards: Array<{
    award: {
      id: string;
      name: string;
    };
  }>;
}

const statusMap: Record<string, string> = {
  COMPLETED: "结题",
  APPROVED: "获准",
  APPLIED: "申请",
  ONGOING: "申请",
  SUSPENDED: "申请",
};

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  PHD: "博士生",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
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

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">未找到该项目</p>
            <Link href="/projects" className="text-blue-400 hover:underline">
              返回项目列表
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
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回项目列表
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Project header */}
            <div className="glass-card p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    project.status === "APPROVED"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "COMPLETED"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {statusMap[project.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                <div>
                  <p className="text-gray-500">负责人</p>
                  <p className="text-white">{project.leader}</p>
                </div>
                {project.fundingSource && (
                  <div>
                    <p className="text-gray-500">资助来源</p>
                    <p className="text-white">{project.fundingSource}</p>
                  </div>
                )}
                {project.fundingAmount && (
                  <div>
                    <p className="text-gray-500">资助金额</p>
                    <p className="text-white">{project.fundingAmount} 万元</p>
                  </div>
                )}
                {project.startDate && (
                  <div>
                    <p className="text-gray-500">起止时间</p>
                    <p className="text-white">
                      {new Date(project.startDate).toLocaleDateString("zh-CN")}
                      {project.endDate &&
                        ` - ${new Date(project.endDate).toLocaleDateString("zh-CN")}`}
                    </p>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-300">{project.description}</p>
                </div>
              )}
            </div>

            {/* Members */}
            {project.members.length > 0 && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  项目成员
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.members.map((pm) => (
                    <div
                      key={pm.member.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold overflow-hidden">
                        {pm.member.avatarUrl ? (
                          <img
                            src={pm.member.avatarUrl}
                            alt={pm.member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          pm.member.name[0]
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{pm.member.name}</p>
                        <p className="text-xs text-gray-400">
                          {titleMap[pm.member.title] || pm.member.title}
                          {pm.role && ` · ${pm.role}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Timeline */}
            {project.progress.length > 0 && (
              <div className="glass-card p-8 mb-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  项目进展
                </h2>
                <div className="space-y-6">
                  {project.progress.map((prog, index) => (
                    <div key={prog.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {index < project.progress.length - 1 && (
                          <div className="w-0.5 flex-1 bg-white/10 mt-1" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm text-gray-500 mb-1">
                          {new Date(prog.progressDate).toLocaleDateString("zh-CN")}
                        </p>
                        <h3 className="font-medium mb-2">{prog.title}</h3>
                        <p className="text-sm text-gray-400">{prog.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Achievements */}
            {(project.publications.length > 0 ||
              project.patents.length > 0 ||
              project.copyrights.length > 0 ||
              project.awards.length > 0) && (
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold mb-6">相关成果</h2>

                {project.publications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      论文
                    </h3>
                    <div className="space-y-2">
                      {project.publications.map((pp) => (
                        <p key={pp.publication.id} className="text-sm text-gray-300">
                          {pp.publication.title} ({pp.publication.year})
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {project.patents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">专利</h3>
                    <div className="space-y-2">
                      {project.patents.map((pp) => (
                        <p key={pp.patent.id} className="text-sm text-gray-300">
                          {pp.patent.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {project.copyrights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      软件著作权
                    </h3>
                    <div className="space-y-2">
                      {project.copyrights.map((pc) => (
                        <p key={pc.copyright.id} className="text-sm text-gray-300">
                          {pc.copyright.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {project.awards.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      获奖
                    </h3>
                    <div className="space-y-2">
                      {project.awards.map((pa) => (
                        <p key={pa.award.id} className="text-sm text-gray-300">
                          {pa.award.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
