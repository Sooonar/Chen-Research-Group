"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock } from "lucide-react";
import Link from "next/link";

/**
 * 校验并归一化显式回跳地址，防开放重定向；无显式回跳时返回 null。
 *
 * 不能用 startsWith("//") 这类字符串判断：`/\evil.com`、`/\t/evil.com`
 * 在浏览器解析 URL 时反斜杠等价于斜杠、制表符会被忽略，最终都会变成
 * `//evil.com` 跳出站外。这里统一交给 URL 解析器判断同源。
 */
function resolveCallbackUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const target = new URL(value, window.location.origin);
    if (target.origin !== window.location.origin) return null;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

/** 无显式回跳地址时按角色决定落地页：普通成员去首页，管理员去后台。 */
async function resolveLandingPath(): Promise<string> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    const data = await res.json();
    const role = data?.user?.role;
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin";
  } catch {
    // 会话读取失败时按普通成员处理
  }
  return "/";
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // signIn 的返回类型是 Promise<...| undefined>，undefined 不能当成成功
      if (!result || result.error) {
        setError("邮箱或密码错误，或账号未通过审核");
        return;
      }

      // 必须整页跳转，不能用 router.push：
      // 未登录时首页对受保护页面的 <Link> 预取会把中间件的 307（弹回登录页）
      // 缓存进 Next.js 客户端路由缓存，登录成功后 router.push 命中这份陈旧
      // 缓存，表现为“登录成功却跳回登录页/毫无反应”。整页导航携带新会话
      // Cookie 且绕过客户端缓存，可彻底避免。
      // 用 replace 而非 assign：登录页不留在历史记录里，后退不会回到登录表单。
      const explicit = resolveCallbackUrl(searchParams.get("callbackUrl"));
      const target = explicit ?? (await resolveLandingPath());
      window.location.replace(target);
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="text-gray-400 mt-2">登录后浏览课题组各模块内容</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            还没有账号？{" "}
            <Link href="/admin/register" className="text-blue-400 hover:underline">
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          加载中...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
