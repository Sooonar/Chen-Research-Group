"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, CreditCard, Shield, Clock, FileText, Plus, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AvatarUpload } from "@/components/upload/avatar-upload";
import { deriveGrade, getAcademicYear, gradeLabels, MAX_FUTURE_ENROLLMENT_YEARS, MIN_ENROLLMENT_YEAR } from "@/lib/member-grade";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  title: string | null;
  grade: number | null;
  enrollmentYear: number | null;
  role: string;
  status: string;
  avatarUrl: string | null;
  createdAt: string;
  member: {
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
    avatarUrl: string | null;
  } | null;
  submissions: Array<{
    id: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
}

const roleMap: Record<string, string> = {
  SUPER_ADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "普通成员",
};

const statusMap: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

const statusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

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

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(false);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    title: "",
    enrollmentYear: "",
  });
  const [memberForm, setMemberForm] = useState({
    title: "",
    enrollmentYear: "",
    phone: "",
    department: "",
    major: "",
    programType: "",
    thesisTitle: "",
    researchDirection: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  // 入学年份下拉：下限固定 2000，上限 = 当前学年 + 2（预入学）
  const currentAcademicYear = getAcademicYear();
  const maxEnrollmentYear = currentAcademicYear + MAX_FUTURE_ENROLLMENT_YEARS;
  const minEnrollmentYear = MIN_ENROLLMENT_YEAR;
  const enrollmentYearOptions = Array.from(
    { length: maxEnrollmentYear - minEnrollmentYear + 1 },
    (_, index) => maxEnrollmentYear - index
  );
  const formGrade = form.enrollmentYear ? deriveGrade(parseInt(form.enrollmentYear)) : null;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm({
            name: data.name || "",
            studentId: data.studentId || "",
            title: data.title || "MASTER",
            enrollmentYear:
              (data.enrollmentYear ?? data.member?.enrollmentYear)?.toString() || "",
          });
          setMemberForm({
            title: data.member?.title || data.title || "MASTER",
            enrollmentYear:
              (data.member?.enrollmentYear ?? data.enrollmentYear)?.toString() || "",
            phone: data.member?.phone || "",
            department: data.member?.department || "",
            major: data.member?.major || "",
            programType: data.member?.programType || "",
            thesisTitle: data.member?.thesisTitle || "",
            researchDirection: data.member?.researchDirection || "",
            bio: data.member?.bio || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (sessionStatus === "authenticated") {
      fetchProfile();
    } else if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditing(false);
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleMemberSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile?.name,
          studentId: profile?.studentId,
          ...memberForm,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditingMember(false);
      } else {
        alert("保存失败");
      }
    } catch (error) {
      console.error("Error saving member info:", error);
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (sessionStatus === "loading" || loading) {
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

  if (sessionStatus === "unauthenticated") {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-400 mb-4">请先登录</p>
            <a href="/admin/login" className="text-blue-400 hover:underline">
              去登录
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
            获取用户信息失败
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-12">
              <span className="gradient-text">个人中心</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 左侧：用户信息卡片 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-1"
            >
              <div className="glass-card p-6 text-center">
                <div className="mx-auto mb-4">
                  <AvatarUpload
                    currentAvatar={profile.avatarUrl || profile.member?.avatarUrl}
                    name={profile.name}
                    onUploadSuccess={(url) => {
                      setProfile({ ...profile, avatarUrl: url });
                    }}
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{profile.email}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    {roleMap[profile.role] || profile.role}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      statusColorMap[profile.status] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {statusMap[profile.status] || profile.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/profile/submissions"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    我的成果
                  </Link>
                  <Link
                    href="/profile/submissions/new"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    提交新成果
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* 右侧：详细信息 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              {/* 基本信息 */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    基本信息
                  </h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      编辑
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">姓名</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">学号/工号</label>
                      <input
                        type="text"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">身份</label>
                      <select
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      >
                        <option value="TEACHER">老师</option>
                        <option value="MASTER">硕士生（在读）</option>
                        <option value="ALUMNI">已毕业（校友）</option>
                      </select>
                    </div>
                    {form.title !== "TEACHER" && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">入学年份</label>
                        <select
                          value={form.enrollmentYear}
                          onChange={(e) => setForm({ ...form, enrollmentYear: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          <option value="">未填写</option>
                          {enrollmentYearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year} 年
                            </option>
                          ))}
                        </select>
                        {form.title === "MASTER" && form.enrollmentYear && (
                          <p className="mt-1 text-xs text-gray-500">
                            {formGrade
                              ? `当前显示为「${gradeLabels[formGrade]}」`
                              : "该年份已超过 3 年学制，请把身份改为「已毕业」"}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                      >
                        {saving ? "保存中..." : "保存"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            name: profile.name || "",
                            studentId: profile.studentId || "",
                            title: profile.title || "MASTER",
                            enrollmentYear:
                              (profile.enrollmentYear ?? profile.member?.enrollmentYear)?.toString() || "",
                          });
                        }}
                        className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">姓名</span>
                      <span>{profile.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">邮箱</span>
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">学号/工号</span>
                      <span>{profile.studentId || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">身份</span>
                      <span>
                        {titleMap[profile.title || ""] || "-"}
                        {profile.title === "MASTER" && (profile.member?.grade ?? profile.grade) && (
                          <span className="ml-2 text-gray-400">
                            ({gradeMap[profile.member?.grade ?? profile.grade ?? 1] || ""})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 w-20">注册时间</span>
                      <span>
                        {new Date(profile.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 成员信息（已审核用户可见） */}
              {profile.status === "APPROVED" && (
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      成员信息
                    </h3>
                    {!editingMember && (
                      <button
                        onClick={() => setEditingMember(true)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        编辑
                      </button>
                    )}
                  </div>

                  {editingMember ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">职称</label>
                        <select
                          value={memberForm.title}
                          onChange={(e) => setMemberForm({ ...memberForm, title: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                          <option value="TEACHER">老师</option>
                          <option value="MASTER">硕士生（在读）</option>
                          <option value="ALUMNI">已毕业（校友）</option>
                        </select>
                      </div>
                      {memberForm.title !== "TEACHER" && (
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">入学年份</label>
                          <select
                            value={memberForm.enrollmentYear}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, enrollmentYear: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          >
                            <option value="">未填写</option>
                            {enrollmentYearOptions.map((year) => (
                              <option key={year} value={year}>
                                {year} 年
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* 学籍信息（与成员档案同步的结构化字段） */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">学号/工号</label>
                          <input
                            type="text"
                            value={profile.studentId || ""}
                            disabled
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            在「基本信息」中修改，保存后自动同步
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">手机号</label>
                          <input
                            type="text"
                            value={memberForm.phone}
                            onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">院系</label>
                          <input
                            type="text"
                            value={memberForm.department}
                            onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">专业</label>
                          <input
                            type="text"
                            value={memberForm.major}
                            onChange={(e) => setMemberForm({ ...memberForm, major: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">学生类别</label>
                          <input
                            type="text"
                            value={memberForm.programType}
                            onChange={(e) => setMemberForm({ ...memberForm, programType: e.target.value })}
                            placeholder="如：全日制学术学位硕士"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">论文题目</label>
                          <input
                            type="text"
                            value={memberForm.thesisTitle}
                            onChange={(e) => setMemberForm({ ...memberForm, thesisTitle: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">研究方向</label>
                        <input
                          type="text"
                          value={memberForm.researchDirection}
                          onChange={(e) => setMemberForm({ ...memberForm, researchDirection: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          placeholder="例如：人工智能、计算机视觉"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">个人简介</label>
                        <textarea
                          value={memberForm.bio}
                          onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                          placeholder="介绍一下自己的研究方向和兴趣"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleMemberSave}
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                        >
                          {saving ? "保存中..." : "保存"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingMember(false);
                            setMemberForm({
                              title: profile.member?.title || profile.title || "MASTER",
                              enrollmentYear:
                                (profile.member?.enrollmentYear ?? profile.enrollmentYear)?.toString() || "",
                              phone: profile.member?.phone || "",
                              department: profile.member?.department || "",
                              major: profile.member?.major || "",
                              programType: profile.member?.programType || "",
                              thesisTitle: profile.member?.thesisTitle || "",
                              researchDirection: profile.member?.researchDirection || "",
                              bio: profile.member?.bio || "",
                            });
                          }}
                          className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 w-20">职称</span>
                        <span>
                          {titleMap[profile.member?.title || profile.title || ""] || "-"}
                          {(profile.member?.title === "MASTER" || profile.title === "MASTER") && 
                           (profile.member?.grade || profile.grade) && (
                            <span className="ml-2 text-gray-400">
                              ({gradeMap[profile.member?.grade || profile.grade || 1] || ""})
                            </span>
                          )}
                        </span>
                      </div>
                      {profile.member?.researchDirection && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 w-20">研究方向</span>
                          <span>{profile.member.researchDirection}</span>
                        </div>
                      )}
                      {profile.member?.bio && (
                        <div>
                          <p className="text-gray-400 mb-1">个人简介</p>
                          <p className="text-gray-300">{profile.member.bio}</p>
                        </div>
                      )}
                      {!profile.member?.researchDirection && !profile.member?.bio && (
                        <p className="text-gray-500 text-sm">暂未填写成员信息，点击编辑完善个人资料</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 账号状态提示 */}
              {profile.status === "PENDING" && (
                <div className="glass-card p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-400">账号审核中</h3>
                      <p className="text-sm text-gray-400">
                        您的账号正在等待管理员审核，审核通过后即可完善成员信息和提交成果。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {profile.status === "REJECTED" && (
                <div className="glass-card p-6 border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-400">账号未通过审核</h3>
                      <p className="text-sm text-gray-400">
                        您的账号未通过审核，请联系管理员了解详情。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
