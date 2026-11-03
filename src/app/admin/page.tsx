"use client";

import Link from "next/link";
import { Users, FileText, Award, Code, FileCode, Settings, LogOut, Newspaper, FolderOpen, Trophy, UserCog, ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const adminMenus = [
  { label: "用户审核", href: "/admin/users", icon: UserCog, description: "审核注册用户，分配角色权限" },
  { label: "成果审核", href: "/admin/submissions", icon: ClipboardCheck, description: "审核用户提交的论文、专利、软著和获奖" },
  { label: "成员管理", href: "/admin/members", icon: Users, description: "管理团队成员信息" },
  { label: "论文管理", href: "/admin/papers", icon: FileText, description: "管理学术论文" },
  { label: "专利管理", href: "/admin/patents", icon: Award, description: "管理专利信息" },
  { label: "软著管理", href: "/admin/copyrights", icon: Code, description: "管理软件著作权" },
  { label: "获奖管理", href: "/admin/awards", icon: Trophy, description: "管理科研/教学/竞赛/学业获奖记录" },
  { label: "项目管理", href: "/admin/projects", icon: FolderOpen, description: "管理科研项目" },
  { label: "新闻管理", href: "/admin/news", icon: Newspaper, description: "管理新闻动态" },
  { label: "算法资源", href: "/admin/algorithms", icon: FileCode, description: "管理算法资源" },
  { label: "网站设置", href: "/admin/settings", icon: Settings, description: "首页内容编辑" },
];

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">管理后台</h1>
            <p className="text-gray-400 mt-1">管理课题组网站内容</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              查看网站
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenus.map((menu) => (
            <Link key={menu.href} href={menu.href}>
              <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                    <menu.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">
                      {menu.label}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {menu.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
