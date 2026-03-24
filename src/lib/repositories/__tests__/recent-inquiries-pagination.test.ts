import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// W-4: getRecentInquiries 페이지네이션(limit) 동작 확인

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("W-4: getRecentInquiries limit 파라미터", () => {
  it("기본 limit(20)으로 픽스처에서 최대 20개까지 반환한다", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase/server", () => ({
      hasSupabaseAdminEnv: () => false,
      createSupabaseAdminClient: vi.fn(),
    }));

    const { getRecentInquiries } = await import("../inquiries");
    const result = await getRecentInquiries();

    expect(result.length).toBeLessThanOrEqual(20);
  });

  it("limit=1이면 최신 문의 1개만 반환한다", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase/server", () => ({
      hasSupabaseAdminEnv: () => false,
      createSupabaseAdminClient: vi.fn(),
    }));

    const { getRecentInquiries } = await import("../inquiries");
    const result = await getRecentInquiries(1);

    expect(result).toHaveLength(1);
  });

  it("limit=2이면 최신 순서대로 2개를 반환한다", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase/server", () => ({
      hasSupabaseAdminEnv: () => false,
      createSupabaseAdminClient: vi.fn(),
    }));

    const { getRecentInquiries } = await import("../inquiries");
    const result = await getRecentInquiries(2);

    expect(result).toHaveLength(2);
    // 내림차순(최신 순) 검증
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].createdAt >= result[i + 1].createdAt).toBe(true);
    }
  });

  it("Supabase 환경에서 limit 값이 쿼리에 전달된다", async () => {
    vi.resetModules();

    const limitChainMock = vi.fn().mockResolvedValue({ data: [], error: null });
    const orderChainMock = vi.fn().mockReturnValue({ limit: limitChainMock });
    const selectChainMock = vi.fn().mockReturnValue({ order: orderChainMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectChainMock });
    const supabaseMock = { from: fromMock };

    vi.doMock("@/lib/supabase/server", () => ({
      hasSupabaseAdminEnv: () => true,
      createSupabaseAdminClient: () => supabaseMock,
    }));

    const { getRecentInquiries } = await import("../inquiries");
    await getRecentInquiries(5);

    expect(limitChainMock).toHaveBeenCalledWith(5);
  });

  it("Supabase에서 에러 발생 시 예외를 던진다", async () => {
    vi.resetModules();

    const limitChainMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "DB error" } });
    const orderChainMock = vi.fn().mockReturnValue({ limit: limitChainMock });
    const selectChainMock = vi.fn().mockReturnValue({ order: orderChainMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectChainMock });

    vi.doMock("@/lib/supabase/server", () => ({
      hasSupabaseAdminEnv: () => true,
      createSupabaseAdminClient: () => ({ from: fromMock }),
    }));

    const { getRecentInquiries } = await import("../inquiries");

    await expect(getRecentInquiries()).rejects.toThrow(
      "[inquiries] 최근 문의 조회에 실패했습니다.",
    );
  });
});
