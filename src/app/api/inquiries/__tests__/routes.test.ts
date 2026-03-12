import { beforeEach, describe, expect, it, vi } from "vitest";

const createInquiryMock = vi.fn();
const getProductBySlugMock = vi.fn();
const getRateLimitKeyMock = vi.fn();
const isRateLimitedMock = vi.fn();

vi.mock("@/lib/repositories/inquiries", () => ({
  createInquiry: createInquiryMock
}));

vi.mock("@/lib/repositories/content", () => ({
  getProductBySlug: getProductBySlugMock
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

describe("inquiry routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getRateLimitKeyMock.mockReturnValue("rate-limit-key");
    isRateLimitedMock.mockResolvedValue(false);
  });

  it("returns 429 for quick inquiries when the rate limit is exceeded", async () => {
    isRateLimitedMock.mockResolvedValue(true);
    const { POST } = await import("../quick/route");

    const response = await POST(
      createJsonRequest({
        name: "홍길동",
        phone: "010-1234-5678",
        sourcePage: "/",
        privacyAgreed: true
      })
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
    });
    expect(createInquiryMock).not.toHaveBeenCalled();
  });

  it("creates product inquiries with the resolved product id and filtered payload", async () => {
    getProductBySlugMock.mockResolvedValue({
      id: "product-id-1",
      slug: "sample-product"
    });
    createInquiryMock.mockResolvedValue({
      success: true,
      id: "inquiry-1"
    });
    const { POST } = await import("../product/route");

    const response = await POST(
      createJsonRequest({
        name: "홍길동",
        phone: "010-1234-5678",
        productSlug: "sample-product",
        sourcePage: "/products/sample-product",
        privacyAgreed: true,
        regionLabel: "서울 강동구",
        contactTimePreference: "afternoon",
        payload: {
          signup_type: "carrier_change",
          desired_bundle: "internet_tv",
          desired_speed: "500M",
          tv_required: "yes",
          mobile_bundle_interest: "interested",
          memo: "이사 예정",
          ignored_field: "drop-me"
        }
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        success: true,
        id: "inquiry-1"
      }
    });
    expect(getProductBySlugMock).toHaveBeenCalledWith("sample-product");
    expect(createInquiryMock).toHaveBeenCalledWith({
      inquiryType: "product",
      name: "홍길동",
      phone: "010-1234-5678",
      sourcePage: "/products/sample-product",
      privacyAgreed: true,
      productId: "product-id-1",
      regionLabel: "서울 강동구",
      contactTimePreference: "afternoon",
      payload: {
        signup_type: "carrier_change",
        desired_bundle: "internet_tv",
        desired_speed: "500M",
        tv_required: "yes",
        mobile_bundle_interest: "interested",
        memo: "이사 예정"
      },
      utm: undefined
    });
  });

  it("returns 404 for product inquiries when the product does not exist", async () => {
    getProductBySlugMock.mockResolvedValue(null);
    const { POST } = await import("../product/route");

    const response = await POST(
      createJsonRequest({
        name: "홍길동",
        phone: "010-1234-5678",
        productSlug: "missing-product",
        sourcePage: "/products/missing-product",
        privacyAgreed: true
      })
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "상품 정보를 찾을 수 없습니다."
    });
    expect(createInquiryMock).not.toHaveBeenCalled();
  });

  it("adds terms_agreed to apply inquiry payloads", async () => {
    createInquiryMock.mockResolvedValue({
      success: true,
      id: "apply-1"
    });
    const { POST } = await import("../apply/route");

    const response = await POST(
      createJsonRequest({
        name: "홍길동",
        phone: "010-1234-5678",
        sourcePage: "/apply",
        privacyAgreed: true,
        termsAgreed: true,
        regionLabel: "서울 강동구",
        contactTimePreference: "morning",
        payload: {
          desired_carrier: "kt",
          internet_plan: "500M"
        }
      })
    );

    expect(response.status).toBe(200);
    expect(createInquiryMock).toHaveBeenCalledWith({
      inquiryType: "apply",
      name: "홍길동",
      phone: "010-1234-5678",
      sourcePage: "/apply",
      privacyAgreed: true,
      regionLabel: "서울 강동구",
      contactTimePreference: "morning",
      payload: {
        desired_carrier: "kt",
        internet_plan: "500M",
        terms_agreed: "true"
      },
      utm: undefined
    });
  });
});
