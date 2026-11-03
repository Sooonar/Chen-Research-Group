"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import {
  deriveGrade,
  getAcademicYear,
  gradeLabels,
  MAX_FUTURE_ENROLLMENT_YEARS,
  MIN_ENROLLMENT_YEAR,
} from "@/lib/member-grade";

export default function RegisterPage() {
  const currentAcademicYear = getAcademicYear();
  // 下限固定 2000（不随学年浮动），上限 = 当前学年 + 2（预入学），每年 9 月自动后移
  const minYear = MIN_ENROLLMENT_YEAR;
  const maxYear = currentAcademicYear + MAX_FUTURE_ENROLLMENT_YEARS;
  const enrollmentYearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, index) => {
      const year = maxYear - index;
      return { year, grade: deriveGrade(year) };
    }
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    title: "MASTER",
    enrollmentYear: "",
  });

  const selectedYear = Number.parseInt(form.enrollmentYear, 10);
  const hasYearInput = Number.isFinite(selectedYear);
  const selectedGrade =
    form.title === "TEACHER" || !hasYearInput ? null : deriveGrade(selectedYear);
  const isFutureEnrollment = hasYearInput && selectedYear > currentAcademicYear;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }

    if (form.title === "MASTER" && !hasYearInput) {
      setError("请选择入学年份");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          studentId: form.studentId,
          title: form.title,
          enrollmentYear:
            form.title === "MASTER" && hasYearInput ? selectedYear : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "注册成功，请等待管理员审核");
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      } else {
        setError(data.error || "注册失败");
      }
    } catch {
      setError("注册失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">成员注册</h1>
          <p className="text-gray-400 mt-2">注册后需等待管理员审核</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              姓名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="请输入真实姓名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              身份 <span className="text-red-400">*</span>
            </label>
            <select
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="TEACHER">老师</option>
              <option value="MASTER">硕士生</option>
            </select>
            <p className="mt-2 text-xs text-gray-500">
              入学年份超过 3 年会被自动记为「已毕业」，无需自己选身份
            </p>
          </div>

          {form.title === "MASTER" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                入学年份 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.enrollmentYear}
                onChange={(e) => setForm({ ...form, enrollmentYear: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="">— 请选择 —</option>
                {enrollmentYearOptions.map((option) => (
                  <option key={option.year} value={option.year}>
                    {option.year} 年
                    {option.grade ? `（${gradeLabels[option.grade]}）` : ""}
                    {option.year > currentAcademicYear ? "（预入学）" : ""}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                {!hasYearInput
                  ? "选择入学年份即可，年级和是否毕业由后台自动判定"
                  : isFutureEnrollment
                    ? `预计 ${selectedYear} 级，到 ${selectedYear} 年 9 月自动显示为「研一」`
                    : selectedGrade
                      ? `按当前（${currentAcademicYear}）学年显示为「${gradeLabels[selectedGrade]}」`
                      : "该年份已超过 3 年学制，提交后将自动记为「已毕业」（保留入学年份供查档）"}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              学号/工号
            </label>
            <input
              type="text"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="请输入学号或工号"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              邮箱 <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              密码 <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="请设置密码（至少6位）"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              确认密码 <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="请再次输入密码"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            已有账号？{" "}
            <Link href="/admin/login" className="text-blue-400 hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
