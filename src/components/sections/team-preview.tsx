"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  title: string;
  grade: number | null;
  researchDirection: string | null;
  avatarUrl: string | null;
}

const titleMap: Record<string, string> = {
  TEACHER: "老师",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

const gradeMap: Record<number, string> = {
  1: "研一",
  2: "研二",
  3: "研三",
};

function getMemberTitle(member: Member): string {
  const title = titleMap[member.title] || member.title;
  if (member.title === "MASTER" && member.grade) {
    return `${title} (${gradeMap[member.grade] || `研${member.grade}`})`;
  }
  return title;
}

export function TeamPreview() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/members");
        if (res.ok) {
          const data = await res.json();
          // 只显示前6位非已毕业成员
          const filtered = data
            .filter((m: Member) => m.title !== "ALUMNI")
            .slice(0, 6);
          setMembers(filtered);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="gradient-text">核心团队</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            我们的团队由经验丰富的导师和充满活力的研究生组成
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400">加载中...</div>
        ) : members.length === 0 ? (
          <div className="text-center text-gray-400">暂无成员数据</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/members/${member.id}`}>
                  <div className="glass-card p-6 hover:bg-white/5 transition-colors duration-200 cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
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
                    <h3 className="text-lg font-semibold text-center group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-blue-400 text-center mb-2">
                      {getMemberTitle(member)}
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                      {member.researchDirection}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/members"
            className="inline-flex items-center px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors duration-200"
          >
            查看全部成员
          </Link>
        </div>
      </div>
    </section>
  );
}
