import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// W-3: 관리자 API 인증 강화 - 인증 없이 접근 시 401/403 반환 확인

const { resolveAdminAuthForMiddlewareMock } = vi.hoisted(() => ({
  resolveAdminAuthForMiddlewareMock: vi.fn(),
}));

vi.mock("@/lib/auth/admin", () => ({
  getAdminSupabaseCookieNames: vi.fn().mockReturnValue({
    accessToken: "internet_dinor_admin_access_token",
    refreshToken: "internet_dinor_admin_refresh_token",
  }),
  resolveAdminAuthForMiddleware: resolveAdminAuthForMiddlewareMock,
}));

import { middleware } from "../middleware";

function createRequest(pathname: string, method = "GET") {
  return new NextRequest(`http://localhost${pathname}`, { method });
}

describe("W-3: 관리자 API 인증 강화", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // 기본: 미인증 상태
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({
      authenticated: false,
    });
  });

  it("인증 없이 /api/admin/products GET 요청 시 401을 반환한다", async () => {
    const request = createRequest("/api/admin/products");

    const response = await middleware(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "관리자 인증이 필요합니다.",
    });
  });

  it("인증 없이 /api/admin/inquiries/uuid GET 요청 시 401을 반환한다", async () => {
    const request = createRequest(
      "/api/admin/inquiries/11111111-1111-1111-1111-111111111111",
    );

    const response = await middleware(request);

    expect(response.status).toBe(401);
  });

  it("인증 없이 /api/admin/settings PATCH 요청 시 (동일 Origin) 401을 반환한다", async () => {
    // PATCH는 상태 변경 메서드이므로 CSRF 검사를 통과시키기 위해 동일 Origin 포함
    const request = new NextRequest("http://localhost/api/admin/settings", {
      method: "PATCH",
      headers: {
        origin: "http://localhost",
        host: "localhost",
      },
    });

    const response = await middleware(request);

    expect(response.status).toBe(401);
  });

  it("인증 없이 /admin/products 페이지 접근 시 /admin/login으로 리다이렉트한다", async () => {
    const request = createRequest("/admin/products");

    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/admin/login",
    );
  });

  it("인증된 요청은 /api/admin/products에 접근할 수 있다", async () => {
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({
      authenticated: true,
    });
    const request = createRequest("/api/admin/products");

    const response = await middleware(request);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it("공개 경로인 /api/admin/login은 인증 없이 통과한다", async () => {
    const request = createRequest("/api/admin/login", "POST");

    const response = await middleware(request);

    // 공개 경로는 resolveAdminAuthForMiddleware를 호출하지 않음
    expect(resolveAdminAuthForMiddlewareMock).not.toHaveBeenCalled();
    expect(response.status).not.toBe(401);
  });

  it("공개 경로인 /api/admin/logout은 인증 없이 통과한다", async () => {
    const request = createRequest("/api/admin/logout", "POST");

    const response = await middleware(request);

    expect(resolveAdminAuthForMiddlewareMock).not.toHaveBeenCalled();
    expect(response.status).not.toBe(401);
  });

  it("/api/admin/system/status는 인증이 없으면 401을 반환한다", async () => {
    const request = createRequest("/api/admin/system/status");

    const response = await middleware(request);

    expect(response.status).toBe(401);
  });
});
