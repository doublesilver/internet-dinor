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
        hero_bgColor: "#4A86CF",
        hero_titleFontSize: "55px",
        hero_titleColor: "#ffffff",
        hero_subtitleFontSize: "18px",
        hero_subtitleColor: "rgba(255,255,255,0.85)",
        carrierProducts_bgColor: "#D6E4F5",
        carrierProducts_headingFontSize: "32px",
        carrierProducts_headingColor: "#4A86CF",
        benefits_bgColor: "#6EA8E0",
        benefits_headingFontSize: "32px",
        benefits_headingColor: "#ffffff",
        cta_bgColor: "#333333",
        cta_headingFontSize: "32px",
        cta_headingColor: "#ffffff",
        recent_headingFontSize: "32px",
        recent_headingColor: "#2C3E50",
        tips_bgColor: "#F5F8FC",
        tips_headingFontSize: "32px",
        tips_headingColor: "#2C3E50",
        carrierNav_fontSize: "24px",
        carrierNav_height: "56px",
        button_fontSize: "14px",
        button_radius: "16px",
        button_primaryColor: "#4A86CF",
        button_primaryDarkColor: "#3A74B8",
        section_padding: "48px"
      }
    });
    expect(createSupabaseAdminClient).not.toHaveBeenCalled();
  });
});
