import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminSessionCookieName, getAdminSupabaseCookieNames, signOutSupabaseAdmin } from "@/lib/auth/admin";

export async function POST() {
  const { accessToken: accessTokenCookieName, refreshToken: refreshTokenCookieName } = getAdminSupabaseCookieNames();
  const store = await cookies();

  await signOutSupabaseAdmin(store.get(accessTokenCookieName)?.value, store.get(refreshTokenCookieName)?.value);

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
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

  return response;
}
