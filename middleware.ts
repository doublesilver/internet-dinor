import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSupabaseCookieNames, resolveAdminAuthForMiddleware } from "@/lib/auth/admin";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

function isProtectedAdminPath(pathname: string) {
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const auth = await resolveAdminAuthForMiddleware(request.cookies);
  if (auth.authenticated) {
    const response = NextResponse.next();

    if (auth.refreshedSession) {
      const { accessToken, refreshToken } = getAdminSupabaseCookieNames();

      response.cookies.set(accessToken, auth.refreshedSession.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: auth.refreshedSession.expiresIn
      });
      response.cookies.set(refreshToken, auth.refreshedSession.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 14
      });
    }

    return response;
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ success: false, message: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
