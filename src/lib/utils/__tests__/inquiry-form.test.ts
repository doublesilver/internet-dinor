import { describe, expect, it } from "vitest";
import {
  buildApplyInquiryPayload,
  buildProductInquiryPayload,
  extractRegionLabel
} from "@/lib/utils/inquiry-form";
import { buildPublicRecentApplications } from "@/data/fixtures/recent-applications";

describe("buildApplyInquiryPayload", () => {
  it("keeps only the safe apply payload fields", () => {
    const payload = buildApplyInquiryPayload([
      ["desired_carrier", "kt"],
      ["memo", "  빠른 연락 부탁드립니다.  "],
      ["account_number", "1234-5678-9999"],
      ["gift_account_number", "9999-8888"],
      ["address_detail", "101동 1203호"]
    ]);

    expect(payload).toEqual({
      desired_carrier: "kt",
      memo: "빠른 연락 부탁드립니다."
    });
  });

  it("drops empty values and trims overly long text", () => {
    const payload = buildApplyInquiryPayload([
      ["memo", " ".repeat(5)],
      ["source_channel", "x".repeat(240)]
    ]);

    expect(payload).toEqual({
      source_channel: "x".repeat(200)
    });
  });
});

describe("buildProductInquiryPayload", () => {
  it("filters product inquiry payload by the allowlist", () => {
    const payload = buildProductInquiryPayload([
      ["signup_type", "carrier_change"],
      ["memo", "법인 회선입니다."],
      ["region_label", "서울 강동구"]
    ]);

    expect(payload).toEqual({
      signup_type: "carrier_change",
      memo: "법인 회선입니다."
    });
  });
});

describe("extractRegionLabel", () => {
  it("keeps the first two address segments", () => {
    expect(extractRegionLabel("서울특별시 강동구 천호대로 1027")).toBe("서울특별시 강동구");
  });

  it("returns an empty string for blank input", () => {
    expect(extractRegionLabel("   ")).toBe("");
  });
});

describe("buildPublicRecentApplications", () => {
  it("builds stable public rows from static templates", () => {
    const rows = buildPublicRecentApplications(new Date("2026-03-12T09:00:00.000Z"));

    expect(rows).toHaveLength(30);
    expect(rows[0]).toEqual({
      date: "03.12",
      name: "김 * *",
      installStatus: "설치완료",
      giftStatus: "입금완료"
    });
    expect(rows[3]?.date).toBe("03.11");
  });
});
