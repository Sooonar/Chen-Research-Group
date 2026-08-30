import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Prisma CLI 不会自动加载 .env 文件（Prisma 7 起）。
// 使用 Next.js 自带的 loadEnvConfig 加载 .env.local，与 Next.js 应用行为保持一致。
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "mysql://root:@localhost:3306/group_website",
  },
});
