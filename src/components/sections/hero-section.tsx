"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  name: string;
  subtitle: string;
  description: string;
}

export function HeroSection({ name, subtitle, description }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/members"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              了解团队
            </a>
            <a
              href="/publications"
              className="px-8 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors duration-200"
            >
              查看成果
            </a>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
