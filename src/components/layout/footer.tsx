"use client";

import { useSiteName } from "@/lib/use-site-name";

export function Footer() {
  const siteName = useSiteName();

  return (
    <footer className="border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@example.com"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              联系我们
            </a>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500 text-xs">
              Powered by Next.js & Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
