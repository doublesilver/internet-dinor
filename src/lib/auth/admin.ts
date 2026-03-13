import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { createSupabasePublicClient, hasSupabasePublicEnv } from "@/lib/supabase/public";

const ADMIN_SESSION_COOKIE = "internet_dinor_admin_session";
const ADMIN_SUPABASE_ACCESS_TOKEN_COOKIE = "internet_dinor_admin_access_token";
const ADMIN_SUPABASE_REFRESH_TOKEN_COOKIE = "internet_dinor_admin_refresh_token";

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export type AdminAuthMode = "preview" | "supabase";

interface RefreshedAdminSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AdminAuthResolution {
  authenticated: boolean;
  refreshedSession?: RefreshedAdminSession;
}

export function getAdminAuthConfig() {
  return {
    email: process.env.ADMIN_PREVIEW_EMAIL,
    password: process.env.ADMIN_PREVIEW_PASSWORD,
    sessionSecret: process.env.ADMIN_SESSION_SECRET
  };
}

export function getAdminAllowedEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminAuthMode(): AdminAuthMode {
  return hasSupabasePublicEnv() ? "supabase" : "preview";
}

export function isAdminAuthConfigured() {
  if (getAdminAuthMode() === "supabase") {
    return getAdminAllowedEmails().length > 0;
  }

  const { email, password, sessionSecret } = getAdminAuthConfig();
  return Boolean(email && password && sessionSecret);
}

export function getAdminAuthDescription() {
  if (getAdminAuthMode() === "supabase") {
    return "현재는 Supabase Auth 기반 관리자 로그인을 사용합니다. 허용 이메일에 등록된 계정만 관리자 화면에 접근할 수 있습니다.";
  }

  return "현재는 외주 1차 제작물 단계이므로, 환경변수 기반 프리뷰 로그인으로 MVP 운영 화면을 보호합니다.";
}

export function getAdminAuthSetupMessage() {
  if (getAdminAuthMode() === "supabase") {
    return "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_ALLOWED_EMAILS를 설정하고 Supabase Auth 사용자 계정을 생성해야 합니다.";
  }

  return "ADMIN_PREVIEW_EMAIL, ADMIN_PREVIEW_PASSWORD, ADMIN_SESSION_SECRET을 설정해야 합니다.";
}

export async function authenticateSupabaseAdmin(email: string, password: string) {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, statusCode: 401, message: "이메일 또는 비밀번호가 올바르지 않습니다." as const };
  }

  const userEmail = data.user?.email?.toLowerCase() ?? null;
  if (!isAllowedAdminEmail(userEmail)) {
    return { success: false, statusCode: 403, message: "관리자 허용 이메일이 아닙니다." as const };
  }

  if (!data.session?.access_token || !data.session.refresh_token) {
    return { success: false, statusCode: 500, message: "Supabase 세션 정보를 확인할 수 없습니다." as const };
  }

  return {
    success: true as const,
    data: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 60 * 60
    }
  };
}

async function verifySupabaseAdminAccessToken(accessToken?: string) {
  if (!accessToken || !hasSupabasePublicEnv()) {
    return false;
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return false;
  }

  return isAllowedAdminEmail(data.user.email);
}

async function refreshSupabaseAdminSession(accessToken?: string, refreshToken?: string) {
  if (!accessToken || !refreshToken || !hasSupabasePublicEnv()) {
    return { success: false as const };
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (error || !data.session?.access_token || !data.session.refresh_token) {
    return { success: false as const };
  }

  const userEmail = data.user?.email?.toLowerCase() ?? null;
  if (!isAllowedAdminEmail(userEmail)) {
    return { success: false as const };
  }

  return {
    success: true as const,
    data: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 60 * 60
    }
  };
}

export function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // 길이가 다르면 timing leak 방지를 위해 동일 길이 버퍼로 비교 후 false 반환
      timingSafeEqual(bufA, bufA);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function isAllowedAdminEmail(email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  return getAdminAllowedEmails().includes(normalizedEmail);
}

export async function isAdminAuthenticatedWithCookieStore(cookieStore: CookieReader) {
  if (getAdminAuthMode() === "supabase") {
    return verifySupabaseAdminAccessToken(cookieStore.get(ADMIN_SUPABASE_ACCESS_TOKEN_COOKIE)?.value);
  }

  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const { sessionSecret } = getAdminAuthConfig();

  return Boolean(sessionValue && sessionSecret && safeCompare(sessionValue, sessionSecret));
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return isAdminAuthenticatedWithCookieStore(store);
}

export async function resolveAdminAuthForMiddleware(cookieStore: CookieReader): Promise<AdminAuthResolution> {
  if (getAdminAuthMode() === "supabase") {
    const accessToken = cookieStore.get(ADMIN_SUPABASE_ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(ADMIN_SUPABASE_REFRESH_TOKEN_COOKIE)?.value;

    if (await verifySupabaseAdminAccessToken(accessToken)) {
      return { authenticated: true };
    }

    const refreshed = await refreshSupabaseAdminSession(accessToken, refreshToken);
    if (refreshed.success) {
      return {
        authenticated: true,
        refreshedSession: refreshed.data
      };
    }

    return { authenticated: false };
  }

  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const { sessionSecret } = getAdminAuthConfig();

  return {
    authenticated: Boolean(sessionValue && sessionSecret && safeCompare(sessionValue, sessionSecret))
  };
}

export async function signOutSupabaseAdmin(accessToken?: string, refreshToken?: string) {
  if (!accessToken || !refreshToken || !hasSupabasePublicEnv()) {
    return;
  }

  const supabase = createSupabasePublicClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  if (error) {
    return;
  }

  await supabase.auth.signOut();
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminSupabaseCookieNames() {
  return {
    accessToken: ADMIN_SUPABASE_ACCESS_TOKEN_COOKIE,
    refreshToken: ADMIN_SUPABASE_REFRESH_TOKEN_COOKIE
  };
}
