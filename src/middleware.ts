import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** 无需登录即可访问的页面路径。 */
const PUBLIC_PATHS = ["/", "/admin/login", "/admin/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保护管理后台路由（登录和注册页面除外）
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/register"
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdmin = token && (token.role === "SUPER_ADMIN" || token.role === "ADMIN");
    if (!isAdmin) {
      return NextResponse.redirect(new URL(token ? "/" : "/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // 其余页面仅登录后可见：未登录跳转登录页并带上回跳地址
  if (!PUBLIC_PATHS.includes(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    // 除 API、静态资源、带扩展名的文件外，其余页面路径都经过门禁
    "/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)",
  ],
};
