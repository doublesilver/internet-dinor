import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClientMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

// 모듈 캐시를 초기화하기 위해 각 테스트 전 리셋
beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  createClientMock.mockReset();
  createClientMock.mockReturnValue({ _isMockClient: true });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createSupabaseAdminClient", () => {
  it("service role key를 사용해 클라이언트를 생성한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-abc");

    const { createSupabaseAdminClient } = await import("../server");
    createSupabaseAdminClient();

    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "service-role-key-abc",
      expect.any(Object),
    );
  });

  it("anon key가 아닌 service role key를 두 번째 인자로 넘긴다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-xyz");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-abc");

    const { createSupabaseAdminClient } = await import("../server");
    createSupabaseAdminClient();

    const secondArg = createClientMock.mock.calls[0][1];
    expect(secondArg).toBe("service-role-key-abc");
    expect(secondArg).not.toBe("anon-key-xyz");
  });

  it("환경변수가 없으면 에러를 던진다", async () => {
    const { createSupabaseAdminClient } = await import("../server");

    expect(() => createSupabaseAdminClient()).toThrow(
      "Supabase admin environment variables are missing.",
    );
  });
});

describe("createSupabaseAnonClient", () => {
  it("anon key를 사용해 클라이언트를 생성한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-xyz");

    const { createSupabaseAnonClient } = await import("../server");
    createSupabaseAnonClient();

    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key-xyz",
      expect.any(Object),
    );
  });

  it("service role key가 아닌 anon key를 두 번째 인자로 넘긴다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-xyz");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-abc");

    const { createSupabaseAnonClient } = await import("../server");
    createSupabaseAnonClient();

    const secondArg = createClientMock.mock.calls[0][1];
    expect(secondArg).toBe("anon-key-xyz");
    expect(secondArg).not.toBe("service-role-key-abc");
  });

  it("환경변수가 없으면 에러를 던진다", async () => {
    const { createSupabaseAnonClient } = await import("../server");

    expect(() => createSupabaseAnonClient()).toThrow(
      "Supabase anon environment variables are missing.",
    );
  });

  it("admin 클라이언트와 anon 클라이언트는 서로 다른 인스턴스다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-xyz");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-abc");

    const adminClient = { _type: "admin" };
    const anonClient = { _type: "anon" };
    createClientMock
      .mockReturnValueOnce(adminClient)
      .mockReturnValueOnce(anonClient);

    const { createSupabaseAdminClient, createSupabaseAnonClient } =
      await import("../server");
    const admin = createSupabaseAdminClient();
    const anon = createSupabaseAnonClient();

    expect(admin).not.toBe(anon);
  });
});

describe("hasSupabaseAnonEnv", () => {
  it("URL과 anon key가 모두 있으면 true를 반환한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-xyz");

    const { hasSupabaseAnonEnv } = await import("../server");
    expect(hasSupabaseAnonEnv()).toBe(true);
  });

  it("anon key만 없으면 false를 반환한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");

    const { hasSupabaseAnonEnv } = await import("../server");
    expect(hasSupabaseAnonEnv()).toBe(false);
  });
});
