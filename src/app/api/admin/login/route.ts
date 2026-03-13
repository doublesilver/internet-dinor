import { NextResponse } from "next/server";
import {
  authenticateSupabaseAdmin,
  getAdminAuthConfig,
  getAdminAuthMode,
  getAdminSessionCookieName,
  getAdminSupabaseCookieNames,
  isAdminAuthConfigured,
  safeCompare
} from "@/lib/auth/admin";
import { getRateLimitKey, isRateLimited } from "@/lib/utils/rate-limit";

export async function POST(request: Request) {
  const rateLimitKey = getRateLimitKey(request, "admin-login");
  if (await isRateLimited(rateLimitKey, 5, 60 * 1000)) {
    return NextResponse.json({ success: false, message: "로그인 시도가 너무 많습니다. 1분 후 다시 시도해주세요." }, { status: 429 });
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, message: "관리자 로그인 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let payload: { email?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const authMode = getAdminAuthMode();
  const { accessToken: accessTokenCookieName, refreshToken: refreshTokenCookieName } = getAdminSupabaseCookieNames();

  if (authMode === "supabase") {
    const result = await authenticateSupabaseAdmin(payload.email ?? "", payload.password ?? "");

    if (!result.success || !("data" in result) || !result.data) {
      return NextResponse.json({ success: false, message: result.message }, { status: result.statusCode });
    }

    const session = result.data;
    const response = NextResponse.json({ success: true, mode: "supabase" });
    response.cookies.set(getAdminSessionCookieName(), "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });
    response.cookies.set(accessTokenCookieName, session.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: session.expiresIn
    });
    response.cookies.set(refreshTokenCookieName, session.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14
    });

    return response;
  }

  const { email, password, sessionSecret } = getAdminAuthConfig();

  if (!safeCompare(payload.email ?? "", email ?? "") || !safeCompare(payload.password ?? "", password ?? "")) {
    return NextResponse.json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(accessTokenCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(refreshTokenCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  response.cookies.set(getAdminSessionCookieName(), sessionSecret!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
