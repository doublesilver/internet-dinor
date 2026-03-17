import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSeedFallbackModules() {
  vi.resetModules();

  const createSupabaseAdminClient = vi.fn();

  vi.doMock("next/cache", () => ({
    revalidateTag: vi.fn(),
    unstable_cache: (fn: (...args: never[]) => Promise<unknown>) => fn
  }));
  vi.doMock("@/lib/supabase/server", () => ({
    hasSupabaseAdminEnv: () => false,
    createSupabaseAdminClient
  }));

  const postsModule = await import("../posts");
  const settingsModule = await import("../settings");

  return {
    postsModule,
    settingsModule,
    createSupabaseAdminClient
  };
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("posts repository seed fallback", () => {
  it("maps board categories to post types", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    expect(postsModule.getBoardTypeFromCategory("event")).toBe("event");
    expect(postsModule.getBoardTypeFromCategory("guide")).toBe("guide");
    expect(postsModule.getBoardTypeFromCategory("notice")).toBe("notice");
    expect(postsModule.getBoardTypeFromCategory("missing")).toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns published posts by type in descending published order", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const events = await postsModule.getPostsByType("event");
    const guides = await postsModule.getPostsByType("guide");
    const notices = await postsModule.getPostsByType("notice");

    expect(events.map((post) => post.slug)).toEqual([
      "review-starbucks-event",
      "credit-card-event",
      "business-internet-event",
      "cash-benefit-event"
    ]);
    expect(guides.map((post) => post.slug)).toEqual([
      "new-vs-renewal",
      "sk-bundle-discount-guide",
      "kt-bundle-discount-guide",
      "lg-bundle-discount-guide",
      "internet-house-intro"
    ]);
    expect(notices.map((post) => post.slug)).toEqual(["site-open-notice"]);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns featured posts in the same descending order as the Supabase path", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const featuredEvents = await postsModule.getFeaturedPosts("event");
    const featuredGuides = await postsModule.getFeaturedPosts("guide");

    expect(featuredEvents.map((post) => post.slug)).toEqual([
      "review-starbucks-event",
      "credit-card-event",
      "business-internet-event",
      "cash-benefit-event"
    ]);
    expect(featuredGuides.map((post) => post.slug)).toEqual([
      "new-vs-renewal",
      "sk-bundle-discount-guide",
      "kt-bundle-discount-guide",
      "lg-bundle-discount-guide",
      "internet-house-intro"
    ]);
    expect(featuredEvents.every((post) => post.isFeatured)).toBe(true);
    expect(featuredGuides.every((post) => post.isFeatured)).toBe(true);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("resolves posts by type and slug or id", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    await expect(postsModule.getPostByTypeAndSlug("guide", "sk-bundle-discount-guide")).resolves.toMatchObject({
      id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeef3",
      type: "guide",
      slug: "sk-bundle-discount-guide",
      ctaLabel: "SK 결합 상담"
    });
    await expect(postsModule.getPostByTypeAndSlug("event", "sk-bundle-discount-guide")).resolves.toBeNull();

    await expect(postsModule.getPostById("ffffffff-ffff-ffff-ffff-ffffffffffff")).resolves.toMatchObject({
      id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
      type: "notice",
      slug: "site-open-notice"
    });
    await expect(postsModule.getPostById("missing")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});

describe("reviews repository seed fallback", () => {
  it("returns published reviews and featured reviews in descending order", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    const reviews = await postsModule.getReviews();
    const featuredReviews = await postsModule.getFeaturedReviews();

    expect(reviews.map((review) => review.slug)).toEqual([
      "fast-install-review",
      "family-bundle-satisfied",
      "renewal-benefit-review",
      "one-person-internet-review",
      "kt-switch-satisfied",
      "newlywed-bundle-review",
      "business-internet-review",
      "skylife-review",
      "lg-uplus-iot-review",
      "hellovision-cable-review"
    ]);
    expect(featuredReviews.map((review) => review.slug)).toEqual([
      "fast-install-review",
      "family-bundle-satisfied",
      "renewal-benefit-review",
      "kt-switch-satisfied",
      "newlywed-bundle-review"
    ]);
    expect(featuredReviews.every((review) => review.featured)).toBe(true);
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("resolves reviews by slug and id", async () => {
    const { postsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    await expect(postsModule.getReviewBySlug("skylife-review")).resolves.toMatchObject({
      id: "34343434-3434-3434-3434-34343434343a",
      reviewType: "bundle",
      slug: "skylife-review"
    });
    await expect(postsModule.getReviewBySlug("missing")).resolves.toBeNull();

    await expect(postsModule.getReviewById("12121212-1212-1212-1212-121212121212")).resolves.toMatchObject({
      id: "12121212-1212-1212-1212-121212121212",
      slug: "fast-install-review",
      featured: true
    });
    await expect(postsModule.getReviewById("missing")).resolves.toBeNull();
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});

describe("site settings repository seed fallback", () => {
  it("returns the default seeded site settings without a Supabase client", async () => {
    const { settingsModule, createSupabaseAdminClient } = await loadSeedFallbackModules();

    await expect(settingsModule.getSiteSettings()).resolves.toEqual({
      siteName: "인터넷공룡",
      phoneLabel: "1544-2825",
      phoneLink: "tel:15442825",
      heroCtaLabel: "최대 지원금 확인",
      secondaryCtaLabel: "전화 상담",
      heroTitle: "이번달 최대로 남김없이!",
      heroAmount: "150만원",
      heroSubtitle: "당일설치! 당일입금!",
      footerNotice: "인터넷공룡은 통신사 공식 판매점으로 안전하고 빠른 상담을 제공합니다.",
      businessInfo: {
        owner: "장윤성",
        businessNumber: "427-31-02018",
        ecommerceNumber: "제 2026-3820239-30-2-00209 호",
        address: "경기도 의정부시 호국로1346번길 125, 2층 207호 (의정부동)",
        email: "ititdragon@gmail.com"
      },
      designSettings: {
        heroFontSize: "55px",
        headingFontSize: "32px",
        bodyFontSize: "16px",
        buttonFontSize: "14px",
        buttonRadius: "16px",
        sectionPadding: "48px",
        primaryColor: "#4A86CF",
        primaryDarkColor: "#3A74B8",
        heroBgColor: "#4A86CF",
        sectionBgColor: "#D6E4F5",
        ctaBgColor: "#333333"
      }
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
