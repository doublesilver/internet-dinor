import { describe, expect, it } from "vitest";
import { applyInquirySchema, quickInquirySchema } from "@/lib/validators/inquiries";
import { buildApplyInquiryPayload } from "@/lib/utils/inquiry-form";

describe("applyInquirySchema", () => {
  it("accepts a safe apply inquiry payload", () => {
    const result = applyInquirySchema.safeParse({
      name: "홍길동",
      phone: "010-1234-5678",
      sourcePage: "/apply",
      privacyAgreed: true,
      termsAgreed: true,
      regionLabel: "서울 강동구",
      contactTimePreference: "afternoon",
      payload: buildApplyInquiryPayload([
        ["desired_carrier", "sk"],
        ["internet_plan", "500M"],
        ["payment_method", "auto_transfer"],
        ["memo", "가능하면 오후에 연락 부탁드립니다."]
      ])
    });

    expect(result.success).toBe(true);
  });

  it("strips unsupported payload keys", () => {
    const result = applyInquirySchema.safeParse({
      name: "홍길동",
      phone: "01012345678",
      sourcePage: "/apply",
      privacyAgreed: true,
      termsAgreed: true,
      payload: {
        desired_carrier: "kt",
        account_number: "123-456-7890",
        card_number: "1111-2222-3333-4444"
      }
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.payload).toEqual({
      desired_carrier: "kt"
    });
  });

  it("rejects oversized top-level text fields", () => {
    const result = applyInquirySchema.safeParse({
      name: "가".repeat(51),
      phone: "01012345678",
      sourcePage: "/apply",
      privacyAgreed: true,
      termsAgreed: true
    });

    expect(result.success).toBe(false);
  });
});

describe("quickInquirySchema", () => {
  it("rejects oversized sourcePage values", () => {
    const result = quickInquirySchema.safeParse({
      name: "홍길동",
      phone: "01012345678",
      privacyAgreed: true,
      sourcePage: "/".padEnd(205, "a")
    });

    expect(result.success).toBe(false);
  });
});
