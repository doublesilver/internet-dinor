import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { getAdminSupabaseCookieNamesMock, resolveAdminAuthForMiddlewareMock } = vi.hoisted(() => ({
  getAdminSupabaseCookieNamesMock: vi.fn(),
  resolveAdminAuthForMiddlewareMock: vi.fn()
}));

vi.mock("@/lib/auth/admin", () => ({
  getAdminSupabaseCookieNames: getAdminSupabaseCookieNamesMock,
  resolveAdminAuthForMiddleware: resolveAdminAuthForMiddlewareMock
}));

import { config, middleware } from "../middleware";

function createRequest(pathname: string) {
  return new NextRequest(`http://localhost${pathname}`);
}

describe("admin middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getAdminSupabaseCookieNamesMock.mockReturnValue({
      accessToken: "internet_dinor_admin_access_token",
      refreshToken: "internet_dinor_admin_refresh_token"
    });
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({ authenticated: false });
  });

  it("keeps the configured admin matchers", () => {
    expect(config).toEqual({
      matcher: ["/admin/:path*", "/api/admin/:path*"]
    });
  });

  it("skips auth checks for public admin paths", async () => {
    const response = await middleware(createRequest("/admin/login"));

    expect(resolveAdminAuthForMiddlewareMock).not.toHaveBeenCalled();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("returns 401 JSON for unauthenticated admin API requests", async () => {
    const response = await middleware(createRequest("/api/admin/products"));

    expect(resolveAdminAuthForMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "관리자 인증이 필요합니다."
    });
  });

  it("redirects unauthenticated admin pages to /admin/login", async () => {
    const response = await middleware(createRequest("/admin/products"));

    expect(resolveAdminAuthForMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/admin/login");
  });

  it("allows authenticated admin requests to continue", async () => {
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({ authenticated: true });

    const response = await middleware(createRequest("/api/admin/products"));

    expect(resolveAdminAuthForMiddlewareMock).toHaveBeenCalledTimes(1);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(getAdminSupabaseCookieNamesMock).not.toHaveBeenCalled();
  });

  it("refreshes Supabase admin cookies when middleware receives a refreshed session", async () => {
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({
      authenticated: true,
      refreshedSession: {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600
      }
    });

    const response = await middleware(createRequest("/admin/settings"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(getAdminSupabaseCookieNamesMock).toHaveBeenCalledTimes(1);
    expect(response.cookies.get("internet_dinor_admin_access_token")?.value).toBe("new-access-token");
    expect(response.cookies.get("internet_dinor_admin_refresh_token")?.value).toBe("new-refresh-token");
  });
});
