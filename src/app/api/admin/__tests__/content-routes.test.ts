import { beforeEach, describe, expect, it, vi } from "vitest";

const createProductMock = vi.fn();
const updateProductMock = vi.fn();
const deleteProductMock = vi.fn();
const updateProductStatusMock = vi.fn();
const createPostOrReviewMock = vi.fn();
const updatePostOrReviewMock = vi.fn();
const deletePostOrReviewMock = vi.fn();
const updatePostOrReviewStatusMock = vi.fn();
const updateSiteSettingsMock = vi.fn();

vi.mock("next/cache", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/cache")>();
  return {
    ...actual,
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  };
});

vi.mock("@/lib/repositories/content", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/repositories/content")>();
  return {
    ...actual,
    createProduct: createProductMock,
    updateProduct: updateProductMock,
    deleteProduct: deleteProductMock,
    updateProductStatus: updateProductStatusMock,
    createPostOrReview: createPostOrReviewMock,
    updatePostOrReview: updatePostOrReviewMock,
    deletePostOrReview: deletePostOrReviewMock,
    updatePostOrReviewStatus: updatePostOrReviewStatusMock,
    updateSiteSettings: updateSiteSettingsMock,
  };
});

function createJsonRequest(
  method: string,
  body: unknown,
  url = "http://localhost/api/admin/test",
) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(
  method: string,
  url = "http://localhost/api/admin/test",
) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
}

function createProductPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "테스트 상품",
    slug: "test-product",
    summary: "테스트 상품 요약",
    description: "테스트 상품 설명",
    carrierId: "11111111-1111-1111-1111-111111111111",
    bundleType: "internet_tv",
    internetSpeed: "500M",
    monthlyPriceLabel: "33,000원",
    benefitLabel: "사은품 최대 40만원",
    badgeTagsText: "추천, 신규",
    targetTagsText: "가족, OTT",
    heroPointsText: "포인트1\n포인트2",
    detailSectionsText: "추천 대상::가족\n혜택::설치비 무료",
    faqItemsText: "설치비::무료",
    tvIncluded: true,
    isFeatured: false,
    status: "published",
    sortOrder: 1,
    ...overrides,
  };
}

function createPostPayload(overrides: Record<string, unknown> = {}) {
  return {
    entityType: "post",
    type: "guide",
    title: "테스트 게시물",
    slug: "test-post",
    summary: "테스트 게시물 요약",
    body: "테스트 게시물 본문",
    ctaLabel: "상담 신청",
    relatedProductSlugsText: "sk-500-btv-all",
    tagsText: "",
    isFeatured: true,
    status: "published",
    publishedAt: "2026-03-13T00:00:00.000Z",
    ...overrides,
  };
}

function createSettingsPayload(overrides: Record<string, unknown> = {}) {
  return {
    siteName: "인터넷공룡",
    phoneLabel: "1544-2825",
    phoneLink: "tel:15442825",
    heroCtaLabel: "최대 지원금 확인",
    secondaryCtaLabel: "전화 상담",
    footerNotice: "안내 문구",
    owner: "인터넷공룡",
    businessNumber: "123-45-67890",
    address: "서울특별시 강동구",
    email: "help@internetdinor.co.kr",
    ...overrides,
  };
}

describe("admin content routes", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects malformed JSON for product creation before calling the repository", async () => {
    const { POST } = await import("../products/route");

    const response = await POST(createInvalidJsonRequest("POST"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 요청 형식입니다.",
    });
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it("creates products and returns repository data", async () => {
    createProductMock.mockResolvedValue({
      success: true,
      data: {
        id: "product-id",
        slug: "test-product",
      },
    });
    const { POST } = await import("../products/route");

    const response = await POST(
      createJsonRequest("POST", createProductPayload()),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        id: "product-id",
        slug: "test-product",
      },
    });
    expect(createProductMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "테스트 상품",
        slug: "test-product",
        bundleType: "internet_tv",
      }),
    );
  });

  it("rejects invalid product ids before parsing patch payloads", async () => {
    const { PATCH } = await import("../products/[id]/route");

    const response = await PATCH(
      createJsonRequest("PATCH", createProductPayload()),
      {
        params: Promise.resolve({ id: "not-a-uuid" }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "잘못된 ID 형식입니다.",
    });
    expect(updateProductMock).not.toHaveBeenCalled();
  });

  it("propagates repository failures from product updates", async () => {
    updateProductMock.mockResolvedValue({
      success: false,
      statusCode: 404,
      message: "상품 정보를 찾을 수 없습니다.",
    });
    const { PATCH } = await import("../products/[id]/route");

    const response = await PATCH(
      createJsonRequest("PATCH", createProductPayload()),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "상품 정보를 찾을 수 없습니다.",
    });
    expect(updateProductMock).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
      expect.objectContaining({ slug: "test-product" }),
    );
  });

  it("deletes products when the id is valid", async () => {
    deleteProductMock.mockResolvedValue({ success: true });
    const { DELETE } = await import("../products/[id]/route");

    const response = await DELETE(
      new Request("http://localhost/api/admin/products/id", {
        method: "DELETE",
      }),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(deleteProductMock).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
    );
  });

  it("updates product status with validated payloads", async () => {
    updateProductStatusMock.mockResolvedValue({
      success: true,
      data: {
        id: "product-id",
        status: "draft",
      },
    });
    const { PATCH } = await import("../products/[id]/status/route");

    const response = await PATCH(
      createJsonRequest("PATCH", { status: "draft" }),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        status: "draft",
      },
    });
    expect(updateProductStatusMock).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
      "draft",
    );
  });

  it("creates posts and reviews through the shared content repository", async () => {
    createPostOrReviewMock.mockResolvedValue({
      success: true,
      data: {
        id: "post-id",
        slug: "test-post",
        entityType: "post",
      },
    });
    const { POST } = await import("../posts/route");

    const response = await POST(createJsonRequest("POST", createPostPayload()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        id: "post-id",
        slug: "test-post",
      },
    });
    expect(createPostOrReviewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: "post",
        type: "guide",
        slug: "test-post",
      }),
    );
  });

  it("rejects invalid post payloads before calling the repository", async () => {
    const { PATCH } = await import("../posts/[id]/route");

    const response = await PATCH(
      createJsonRequest("PATCH", createPostPayload({ slug: "INVALID SLUG" })),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다.",
    });
    expect(updatePostOrReviewMock).not.toHaveBeenCalled();
  });

  it("requires entityType when deleting posts or reviews", async () => {
    const { DELETE } = await import("../posts/[id]/route");

    const response = await DELETE(
      new Request("http://localhost/api/admin/posts/post-id", {
        method: "DELETE",
      }),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "entityType이 필요합니다.",
    });
    expect(deletePostOrReviewMock).not.toHaveBeenCalled();
  });

  it("deletes posts and reviews with the requested entity type", async () => {
    deletePostOrReviewMock.mockResolvedValue({ success: true });
    const { DELETE } = await import("../posts/[id]/route");

    const response = await DELETE(
      new Request(
        "http://localhost/api/admin/posts/post-id?entityType=review",
        { method: "DELETE" },
      ),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(deletePostOrReviewMock).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
      "review",
    );
  });

  it("updates post or review status and propagates repository errors", async () => {
    updatePostOrReviewStatusMock.mockResolvedValue({
      success: false,
      statusCode: 404,
      message: "후기 정보를 찾을 수 없습니다.",
    });
    const { PATCH } = await import("../posts/[id]/status/route");

    const response = await PATCH(
      createJsonRequest("PATCH", { entityType: "review", status: "published" }),
      {
        params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }),
      },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "후기 정보를 찾을 수 없습니다.",
    });
    expect(updatePostOrReviewStatusMock).toHaveBeenCalledWith(
      "11111111-1111-1111-1111-111111111111",
      "review",
      "published",
    );
  });

  it("validates settings payloads before calling updateSiteSettings", async () => {
    const { PATCH } = await import("../settings/route");

    const response = await PATCH(
      createJsonRequest("PATCH", createSettingsPayload({ email: "bad-email" })),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      message: "올바른 이메일 형식을 입력해주세요.",
    });
    expect(updateSiteSettingsMock).not.toHaveBeenCalled();
  });

  it("updates settings and returns repository data", async () => {
    updateSiteSettingsMock.mockResolvedValue({
      success: true,
      data: {
        siteName: "인터넷공룡 프로",
        phoneLabel: "1544-0000",
      },
    });
    const { PATCH } = await import("../settings/route");

    const response = await PATCH(
      createJsonRequest("PATCH", createSettingsPayload()),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        siteName: "인터넷공룡 프로",
        phoneLabel: "1544-0000",
      },
    });
    expect(updateSiteSettingsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        siteName: "인터넷공룡",
        email: "help@internetdinor.co.kr",
      }),
    );
  });
});
