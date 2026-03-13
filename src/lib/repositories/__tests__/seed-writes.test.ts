import { afterEach, describe, expect, it, vi } from "vitest";
import type { PostEditorValues, ProductEditorValues, SettingsEditorValues } from "@/lib/validators/content";

const EXISTING_PRODUCT_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const EXISTING_POST_ID = "dddddddd-dddd-dddd-dddd-ddddddddddde";
const EXISTING_REVIEW_ID = "34343434-3434-3434-3434-343434343439";

async function loadSeedFallbackModules() {
  vi.resetModules();

  const createSupabaseAdminClient = vi.fn();

  vi.doMock("next/cache", () => ({
    revalidateTag: vi.fn(),
    unstable_cache: (fn: (...args: unknown[]) => unknown) => fn
  }));
  vi.doMock("@/lib/supabase/server", () => ({
    hasSupabaseAdminEnv: () => false,
    createSupabaseAdminClient
  }));

  const productsModule = await import("../products");
  const postsModule = await import("../posts");
  const settingsModule = await import("../settings");

  return {
    productsModule,
    postsModule,
    settingsModule,
    createSupabaseAdminClient
  };
}

function createProductInput(overrides: Partial<ProductEditorValues> = {}): ProductEditorValues {
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
    heroPointsText: "첫 번째 포인트\n두 번째 포인트",
    detailSectionsText: "추천 대상::가족 고객\n혜택::설치비 무료",
    faqItemsText: "설치비::무료\n약정::3년",
    tvIncluded: true,
    isFeatured: false,
    status: "published",
    sortOrder: 99,
    ...overrides
  };
}

function createPostInput(overrides: Partial<PostEditorValues> = {}): PostEditorValues {
  return {
    entityType: "post",
    type: "guide",
    title: "테스트 게시물",
    slug: "test-post",
    summary: "테스트 게시물 요약",
    body: "테스트 게시물 본문",
    ctaLabel: "상담 신청",
    relatedProductSlugsText: "sk-500-btv-all, kt-500-otv-basic",
    tagsText: "",
    isFeatured: true,
    status: "published",
    publishedAt: "2026-03-12T09:00:00.000Z",
    ...overrides
  };
}

function createReviewInput(overrides: Partial<PostEditorValues> = {}): PostEditorValues {
  return {
    entityType: "review",
    reviewType: "bundle",
    title: "테스트 후기",
    slug: "test-review",
    summary: "테스트 후기 요약",
    body: "테스트 후기 본문",
    ctaLabel: "",
    relatedProductSlugsText: "",
    tagsText: "후기, 설치",
    isFeatured: false,
    status: "published",
    publishedAt: "2026-03-12T09:00:00.000Z",
    ...overrides
  };
}

function createSettingsInput(overrides: Partial<SettingsEditorValues> = {}): SettingsEditorValues {
  return {
    siteName: "인터넷공룡 프로",
    phoneLabel: "1544-0000",
    phoneLink: "tel:15440000",
    heroCtaLabel: "상담 시작",
    secondaryCtaLabel: "지금 전화",
    footerNotice: "변경된 안내 문구입니다.",
    owner: "공룡미디어",
    businessNumber: "123-45-67890",
    address: "서울특별시 송파구",
    email: "hello@internetdinor.co.kr",
    ...overrides
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.resetModules();
});

describe("seed fallback repository writes", () => {
  it("updates site settings in memory and exposes the new values through reads", async () => {
    const { settingsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const result = await settingsModule.updateSiteSettings(createSettingsInput());

    expect(result).toMatchObject({
      success: true,
      data: {
        siteName: "인터넷공룡 프로",
        phoneLabel: "1544-0000",
        businessInfo: {
          owner: "공룡미디어",
          businessNumber: "123-45-67890"
        }
      }
    });
    await expect(settingsModule.getSiteSettings()).resolves.toMatchObject({
      siteName: "인터넷공룡 프로",
      heroCtaLabel: "상담 시작",
      businessInfo: {
        address: "서울특별시 송파구",
        email: "hello@internetdinor.co.kr"
      }
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("updates a product and parses text fields into structured seed data", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const result = await productsModule.updateProduct(
      EXISTING_PRODUCT_ID,
      createProductInput({
        name: "업데이트 상품",
        slug: "updated-product",
        badgeTagsText: "업데이트, 추천",
        targetTagsText: "가족, 재택",
        heroPointsText: "속도 업\n혜택 업",
        detailSectionsText: "추천 대상::재택근무 고객\n혜택::설치비 면제",
        faqItemsText: "설치 일정::당일 가능\n약정::3년",
        tvIncluded: false,
        isFeatured: true,
        status: "draft",
        sortOrder: 7
      })
    );

    expect(result).toMatchObject({
      success: true,
      data: {
        id: EXISTING_PRODUCT_ID,
        name: "업데이트 상품",
        slug: "updated-product",
        badgeTags: ["업데이트", "추천"],
        targetTags: ["가족", "재택"],
        heroPoints: ["속도 업", "혜택 업"],
        detailSections: [
          { title: "추천 대상", body: "재택근무 고객" },
          { title: "혜택", body: "설치비 면제" }
        ],
        faqItems: [
          { q: "설치 일정", a: "당일 가능" },
          { q: "약정", a: "3년" }
        ],
        tvIncluded: false,
        isFeatured: true,
        status: "draft",
        sortOrder: 7
      }
    });
    await expect(productsModule.getProductById(EXISTING_PRODUCT_ID)).resolves.toMatchObject({
      slug: "updated-product",
      status: "draft"
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("creates, updates status for, and deletes a seed-backed product", async () => {
    const { productsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("99999999-9999-9999-9999-999999999999")
    });

    const created = await productsModule.createProduct(createProductInput());
    expect(created).toMatchObject({
      success: true,
      data: {
        id: "99999999-9999-9999-9999-999999999999",
        slug: "test-product",
        detailSections: [
          { title: "추천 대상", body: "가족 고객" },
          { title: "혜택", body: "설치비 무료" }
        ]
      }
    });
    await expect(productsModule.getProductById("99999999-9999-9999-9999-999999999999")).resolves.toMatchObject({
      name: "테스트 상품"
    });

    await expect(productsModule.updateProductStatus("99999999-9999-9999-9999-999999999999", "draft")).resolves.toMatchObject({
      success: true,
      data: { status: "draft" }
    });
    await expect(productsModule.deleteProduct("99999999-9999-9999-9999-999999999999")).resolves.toEqual({ success: true });
    await expect(productsModule.getProductById("99999999-9999-9999-9999-999999999999")).resolves.toBeNull();
    await expect(productsModule.deleteProduct("99999999-9999-9999-9999-999999999999")).resolves.toMatchObject({
      success: false,
      statusCode: 404
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("updates a post and persists the parsed related product slugs", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const result = await postsModule.updatePostOrReview(
      EXISTING_POST_ID,
      createPostInput({
        type: "notice",
        title: "업데이트 게시물",
        slug: "updated-post",
        relatedProductSlugsText: "sk-500-btv-all, lg-500-tv-basic",
        isFeatured: false,
        publishedAt: "2026-03-11T09:00:00.000Z"
      })
    );

    expect(result).toMatchObject({
      success: true,
      data: {
        id: EXISTING_POST_ID,
        type: "notice",
        slug: "updated-post",
        relatedProductSlugs: ["sk-500-btv-all", "lg-500-tv-basic"],
        isFeatured: false,
        publishedAt: "2026-03-11T09:00:00.000Z"
      }
    });
    await expect(postsModule.getPostById(EXISTING_POST_ID)).resolves.toMatchObject({
      type: "notice",
      slug: "updated-post"
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("creates, updates status for, and deletes a seed-backed post", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("77777777-7777-7777-7777-777777777777")
    });

    const created = await postsModule.createPostOrReview(createPostInput());
    expect(created).toMatchObject({
      success: true,
      data: {
        id: "77777777-7777-7777-7777-777777777777",
        type: "guide",
        slug: "test-post",
        relatedProductSlugs: ["sk-500-btv-all", "kt-500-otv-basic"]
      }
    });
    await expect(postsModule.getPostById("77777777-7777-7777-7777-777777777777")).resolves.toMatchObject({
      title: "테스트 게시물"
    });

    await expect(postsModule.updatePostOrReviewStatus("77777777-7777-7777-7777-777777777777", "post", "draft")).resolves.toMatchObject({
      success: true,
      data: { status: "draft" }
    });
    await expect(postsModule.deletePostOrReview("77777777-7777-7777-7777-777777777777", "post")).resolves.toEqual({ success: true });
    await expect(postsModule.getPostById("77777777-7777-7777-7777-777777777777")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("updates a review and parses tags into an array", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const result = await postsModule.updatePostOrReview(
      EXISTING_REVIEW_ID,
      createReviewInput({
        title: "업데이트 후기",
        slug: "updated-review",
        reviewType: "moving",
        tagsText: "이사, 당일설치",
        isFeatured: true,
        status: "draft"
      })
    );

    expect(result).toMatchObject({
      success: true,
      data: {
        id: EXISTING_REVIEW_ID,
        slug: "updated-review",
        reviewType: "moving",
        tags: ["이사", "당일설치"],
        featured: true,
        status: "draft"
      }
    });
    await expect(postsModule.getReviewById(EXISTING_REVIEW_ID)).resolves.toMatchObject({
      slug: "updated-review",
      featured: true
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("creates, updates status for, and deletes a seed-backed review", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("88888888-8888-8888-8888-888888888888")
    });

    const created = await postsModule.createPostOrReview(createReviewInput());
    expect(created).toMatchObject({
      success: true,
      data: {
        id: "88888888-8888-8888-8888-888888888888",
        slug: "test-review",
        tags: ["후기", "설치"]
      }
    });
    await expect(postsModule.getReviewById("88888888-8888-8888-8888-888888888888")).resolves.toMatchObject({
      title: "테스트 후기"
    });

    await expect(postsModule.updatePostOrReviewStatus("88888888-8888-8888-8888-888888888888", "review", "draft")).resolves.toMatchObject({
      success: true,
      data: { status: "draft" }
    });
    await expect(postsModule.deletePostOrReview("88888888-8888-8888-8888-888888888888", "review")).resolves.toEqual({ success: true });
    await expect(postsModule.getReviewById("88888888-8888-8888-8888-888888888888")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
