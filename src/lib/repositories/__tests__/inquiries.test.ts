import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadSeedFallbackModule() {
  vi.resetModules();

  const createSupabaseAdminClient = vi.fn();

  vi.doMock("@/lib/supabase/server", () => ({
    hasSupabaseAdminEnv: () => false,
    hasSupabaseAnonEnv: () => false,
    createSupabaseAdminClient,
  }));

  const inquiriesModule = await import("../inquiries");

  return {
    inquiriesModule,
    createSupabaseAdminClient,
  };
}

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.resetModules();
});

describe("inquiries repository seed fallback", () => {
  it("returns inquiry fixtures in descending created order without a Supabase client", async () => {
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    const result = await inquiriesModule.getInquiryFixtures();

    expect(result.items.map((item) => item.id)).toEqual([
      "inq-demo-001",
      "inq-demo-002",
      "inq-demo-003",
    ]);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("resolves inquiry details by id and returns null for missing fixtures", async () => {
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    await expect(
      inquiriesModule.getInquiryById("inq-demo-002"),
    ).resolves.toMatchObject({
      id: "inq-demo-002",
      status: "contacted",
      adminMemo: "1차 연락 완료",
      regionLabel: "서울 강동구",
    });
    await expect(inquiriesModule.getInquiryById("missing")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("updates fixture-backed inquiries and stamps updatedAt with the current time", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-13T00:00:00.000Z"));
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    const result = await inquiriesModule.updateInquiry("inq-demo-001", {
      status: "consulted",
      adminMemo: "2차 상담 완료",
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        id: "inq-demo-001",
        status: "consulted",
        adminMemo: "2차 상담 완료",
        updatedAt: "2026-03-13T00:00:00.000Z",
      },
    });
    await expect(
      inquiriesModule.getInquiryById("inq-demo-001"),
    ).resolves.toMatchObject({
      status: "consulted",
      adminMemo: "2차 상담 완료",
      updatedAt: "2026-03-13T00:00:00.000Z",
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns 404 when updating a missing inquiry fixture", async () => {
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    await expect(
      inquiriesModule.updateInquiry("missing", { status: "closed" }),
    ).resolves.toMatchObject({
      success: false,
      statusCode: 404,
      message: "문의 정보를 찾을 수 없습니다.",
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("summarizes inquiry counts using Asia/Seoul today semantics", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-11T12:00:00.000Z"));
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    const summary = await inquiriesModule.getInquiryDashboardSummary();

    expect(summary).toEqual({
      total: 3,
      today: 1,
      statusCount: {
        new: 1,
        pending: 1,
        contacted: 1,
        retry: 0,
        consulted: 0,
        in_progress: 0,
        closed: 0,
      },
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns user-facing labels for each inquiry status", async () => {
    const { inquiriesModule, createSupabaseAdminClient } =
      await loadSeedFallbackModule();

    expect(inquiriesModule.getInquiryStatusLabel("new")).toBe("신규");
    expect(inquiriesModule.getInquiryStatusLabel("pending")).toBe("연락대기");
    expect(inquiriesModule.getInquiryStatusLabel("contacted")).toBe("연락완료");
    expect(inquiriesModule.getInquiryStatusLabel("retry")).toBe("부재/재시도");
    expect(inquiriesModule.getInquiryStatusLabel("consulted")).toBe("상담완료");
    expect(inquiriesModule.getInquiryStatusLabel("in_progress")).toBe(
      "신청진행",
    );
    expect(inquiriesModule.getInquiryStatusLabel("closed")).toBe("종료/보류");
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
