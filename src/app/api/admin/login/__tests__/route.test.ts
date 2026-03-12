import { beforeEach, describe, expect, it, vi } from "vitest";

const authenticateSupabaseAdminMock = vi.fn();
const getAdminAuthConfigMock = vi.fn();
const getAdminAuthModeMock = vi.fn();
const getAdminSessionCookieNameMock = vi.fn();
const getAdminSupabaseCookieNamesMock = vi.fn();
const isAdminAuthConfiguredMock = vi.fn();
const getRateLimitKeyMock = vi.fn();
const isRateLimitedMock = vi.fn();

vi.mock("@/lib/auth/admin", () => ({
  authenticateSupabaseAdmin: authenticateSupabaseAdminMock,
  getAdminAuthConfig: getAdminAuthConfigMock,
  getAdminAuthMode: getAdminAuthModeMock,
  getAdminSessionCookieName: getAdminSessionCookieNameMock,
  getAdminSupabaseCookieNames: getAdminSupabaseCookieNamesMock,
  isAdminAuthConfigured: isAdminAuthConfiguredMock
}));

vi.mock("@/lib/utils/rate-limit", () => ({
  getRateLimitKey: getRateLimitKeyMock,
  isRateLimited: isRateLimitedMock
}));

function createJsonRequest(body: unknown) {
  return new Request("http://localhost", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-real-ip": "127.0.0.1" },
    body: JSON.stringify(body)
  });
}

describe("admin login route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getRateLimitKeyMock.mockReturnValue("admin-login-key");
    isRateLimitedMock.mockResolvedValue(false);
    isAdminAuthConfiguredMock.mockReturnValue(true);
    getAdminAuthModeMock.mockReturnValue("preview");
    getAdminAuthConfigMock.mockReturnValue({
      email: "admin@example.com",
      password: "secret123",
      sessionSecret: "session-secret"
    });
    getAdminSupabaseCookieNamesMock.mockReturnValue({
      accessToken: "admin-access-token",
      refreshToken: "admin-refresh-token"
    });
    getAdminSessionCookieNameMock.mockReturnValue("internet_dinor_admin_session");
  });

  it("returns 429 before authentication when the rate limit is exceeded", async () => {
    isRateLimitedMock.mockResolvedValue(true);
    const { POST } = await import("../route");

    const response = await POST(createJsonRequest({ email: "admin@example.com", password: "secret123" }));

    expect(response.status).toBe(429);
    expect(authenticateSupabaseAdminMock).not.toHaveBeenCalled();
  });

  it("rejects invalid preview credentials", async () => {
    const { POST } = await import("../route");

    const response = await POST(createJsonRequest({ email: "wrong@example.com", password: "bad-pass1" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "이메일 또는 비밀번호가 올바르지 않습니다."
    });
  });

  it("sets the preview session cookie on successful preview login", async () => {
    const { POST } = await import("../route");

    const response = await POST(createJsonRequest({ email: "admin@example.com", password: "secret123" }));
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });
    expect(setCookie).toContain("internet_dinor_admin_session=session-secret");
    expect(setCookie).toContain("admin-access-token=;");
    expect(setCookie).toContain("admin-refresh-token=;");
  });

  it("sets Supabase auth cookies on successful Supabase admin login", async () => {
    getAdminAuthModeMock.mockReturnValue("supabase");
    authenticateSupabaseAdminMock.mockResolvedValue({
      success: true,
      data: {
        accessToken: "supabase-access",
        refreshToken: "supabase-refresh",
        expiresIn: 3600
      }
    });
    const { POST } = await import("../route");

    const response = await POST(createJsonRequest({ email: "admin@example.com", password: "secret123" }));
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      mode: "supabase"
    });
    expect(authenticateSupabaseAdminMock).toHaveBeenCalledWith("admin@example.com", "secret123");
    expect(setCookie).toContain("internet_dinor_admin_session=;");
    expect(setCookie).toContain("admin-access-token=supabase-access");
    expect(setCookie).toContain("admin-refresh-token=supabase-refresh");
  });
});
