import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 邮箱格式验证
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * NextAuth 配置。
 * 抽到独立文件后，`[...nextauth]` 路由和需要读取登录态的 API（如“我的获奖”）共用同一份配置。
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as unknown as NextAuthOptions["adapter"],
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 验证邮箱格式
        const email = credentials.email.toLowerCase().trim();
        if (!validateEmail(email)) {
          return null;
        }

        // 使用参数化查询（Prisma自动防止SQL注入）
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.status !== "APPROVED") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24小时过期
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = (user as { role?: string }).role;
        if (role) token.role = role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.role) session.user.role = token.role;
        if (token.sub) session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
