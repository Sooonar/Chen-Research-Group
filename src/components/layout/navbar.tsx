"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut } from "lucide-react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "团队成员", href: "/members" },
  { label: "科研成果", href: "/publications" },
  { label: "科研项目", href: "/projects" },
  { label: "获奖", href: "/publications?tab=awards" },
  { label: "竞赛", href: "/competitions" },
  { label: "新闻动态", href: "/news" },
  { label: "算法资源", href: "/algorithms" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin =
    session?.user &&
    (session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN");

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold gradient-text">
            陈老师课题组
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  个人中心
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    管理后台
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
              >
                登录
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  个人中心
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    管理后台
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                登录
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
