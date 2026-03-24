import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

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

function createPostRequest(url: string, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: "POST",
    headers,
  });
}

function createGetRequest(url: string, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: "GET",
    headers,
  });
}

describe("CSRF 보호 - Origin 검증", () => {
  beforeEach(() => {
    resolveAdminAuthForMiddlewareMock.mockResolvedValue({
      authenticated: true,
    });
  });

  it("Origin도 Referer도 없는 POST 요청 시 fail-closed로 403을 반환한다", async () => {
    // Origin/Referer 모두 없으면 출처를 알 수 없으므로 차단
    const request = createPostRequest("http://localhost/api/inquiries/quick");

    const response = await middleware(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 요청 출처입니다.",
    });
  });

  it("Referer만 있고 Origin이 없을 때 동일 호스트이면 통과한다", async () => {
    const request = createPostRequest("http://localhost/api/inquiries/quick", {
      referer: "http://localhost/",
      host: "localhost",
    });

    const response = await middleware(request);

    expect(response.status).not.toBe(403);
  });

  it("Referer만 있고 Origin이 없을 때 다른 호스트이면 403을 반환한다", async () => {
    const request = createPostRequest("http://localhost/api/inquiries/quick", {
      referer: "https://evil.example.com/page",
      host: "localhost",
    });

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });

  it("동일 호스트 Origin으로 POST 요청 시 통과한다", async () => {
    const request = createPostRequest("http://localhost/api/inquiries/quick", {
      origin: "http://localhost",
      host: "localhost",
    });

    const response = await middleware(request);

    expect(response.status).not.toBe(403);
  });

  it("다른 도메인 Origin으로 POST 요청 시 403을 반환한다", async () => {
    const request = createPostRequest("http://localhost/api/inquiries/quick", {
      origin: "https://evil.example.com",
      host: "localhost",
    });

    const response = await middleware(request);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 요청 출처입니다.",
    });
  });

  it("다른 도메인 Origin으로 관리자 API POST 요청 시 403을 반환한다", async () => {
    const request = createPostRequest("http://localhost/api/admin/products", {
      origin: "https://attacker.example.com",
      host: "localhost",
    });

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });

  it("GET 요청은 Origin이 없어도 403이 아닌 응답을 반환한다", async () => {
    const request = createGetRequest("http://localhost/api/reviews");

    const response = await middleware(request);

    expect(response.status).not.toBe(403);
  });

  it("PATCH 요청에서 다른 도메인 Origin이면 403을 반환한다", async () => {
    const request = new NextRequest(
      "http://localhost/api/admin/inquiries/11111111-1111-1111-1111-111111111111",
      {
        method: "PATCH",
        headers: {
          origin: "https://evil.example.com",
          host: "localhost",
        },
      },
    );

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });

  it("DELETE 요청에서 다른 도메인 Origin이면 403을 반환한다", async () => {
    const request = new NextRequest(
      "http://localhost/api/admin/products/11111111-1111-1111-1111-111111111111",
      {
        method: "DELETE",
        headers: {
          origin: "https://evil.example.com",
          host: "localhost",
        },
      },
    );

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });

  it("PUT 요청에서 다른 도메인 Origin이면 403을 반환한다", async () => {
    const request = new NextRequest("http://localhost/api/admin/settings", {
      method: "PUT",
      headers: {
        origin: "https://evil.example.com",
        host: "localhost",
      },
    });

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });

  it("동일 호스트 Origin + 포트가 일치하면 통과한다", async () => {
    const request = createPostRequest(
      "http://localhost:3000/api/inquiries/quick",
      {
        origin: "http://localhost:3000",
        host: "localhost:3000",
      },
    );

    const response = await middleware(request);

    expect(response.status).not.toBe(403);
  });

  it("포트가 다른 Origin이면 403을 반환한다", async () => {
    const request = createPostRequest(
      "http://localhost:3000/api/inquiries/quick",
      {
        origin: "http://localhost:4000",
        host: "localhost:3000",
      },
    );

    const response = await middleware(request);

    expect(response.status).toBe(403);
  });
});
