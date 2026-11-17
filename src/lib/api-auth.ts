import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export type Role = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type GuardResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

/**
 * 读取当前登录用户（以数据库为准，角色变更后立即生效，不受 JWT 里的旧角色影响）。
 * 未登录、用户已被删除或未通过审核都返回 null。
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  if (!user || user.status !== "APPROVED") return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/** 写接口通用：必须登录。 */
export async function requireUser(): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "未登录或账号未通过审核" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}

/** 写接口通用：管理员（含超级管理员）。 */
export async function requireAdmin(): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "未登录或账号未通过审核" }, { status: 401 }),
    };
  }
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "无权限" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}

/** 仅超级管理员（操作日志的查看与清理）。 */
export async function requireSuperAdmin(): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "未登录或账号未通过审核" }, { status: 401 }),
    };
  }
  if (user.role !== "SUPER_ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "仅超级管理员可访问操作日志" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}
