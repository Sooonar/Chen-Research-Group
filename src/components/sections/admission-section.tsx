"use client";

import { motion } from "framer-motion";
import { Mail, GraduationCap } from "lucide-react";

interface AdmissionSectionProps {
  admissionInfo: string;
  contactEmail: string;
}

export function AdmissionSection({
  admissionInfo,
  contactEmail,
}: AdmissionSectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                <span className="gradient-text">招生信息</span>
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {admissionInfo}
              </p>
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold text-white">招生要求：</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>对科研有浓厚兴趣，具备自驱力</li>
                  <li>具有扎实的数学和编程基础</li>
                  <li>良好的英文阅读和写作能力</li>
                  <li>有相关研究经验者优先</li>
                </ul>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  联系导师
                </a>
                <span className="text-gray-500 text-sm">
                  请附上个人简历和研究兴趣说明
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
