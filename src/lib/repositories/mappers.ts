import type { Carrier, DesignSettings, InquiryRecord, Post, Product, Review, SiteSettings } from "@/types/domain";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function asKeyValue(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, String(item)]));
}

function asUnknownRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function asDetailSections(value: unknown): Array<{ title: string; body: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: String((item as { title?: unknown }).title ?? ""),
      body: String((item as { body?: unknown }).body ?? "")
    }));
}

function asFaqItems(value: unknown): Array<{ q: string; a: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      q: String((item as { q?: unknown }).q ?? ""),
      a: String((item as { a?: unknown }).a ?? "")
    }));
}

export function mapCarrierRow(row: Record<string, unknown>): Carrier {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    shortName: String(row.short_name),
    summary: String(row.summary ?? ""),
    heroTitle: String(row.hero_title ?? ""),
    heroDescription: String(row.hero_description ?? ""),
    featurePoints: asStringArray(row.feature_points),
    status: row.status === "draft" ? "draft" : "published",
    sortOrder: Number(row.sort_order ?? 0)
  };
}

export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    carrierId: String(row.carrier_id ?? ""),
    slug: String(row.slug),
    name: String(row.name),
    summary: String(row.summary ?? ""),
    description: String(row.description ?? ""),
    bundleType:
      row.bundle_type === "internet_tv" || row.bundle_type === "business" || row.bundle_type === "custom"
        ? row.bundle_type
        : "internet_only",
    internetSpeed: String(row.internet_speed ?? ""),
    tvIncluded: Boolean(row.tv_included),
    monthlyPriceLabel: String(row.monthly_price_label ?? ""),
    originalPriceLabel: row.original_price_label ? String(row.original_price_label) : undefined,
    benefitLabel: String(row.benefit_label ?? ""),
    badgeTags: asStringArray(row.badge_tags),
    targetTags: asStringArray(row.target_tags),
    heroPoints: asStringArray(row.hero_points),
    detailSections: asDetailSections(row.detail_sections),
    faqItems: asFaqItems(row.faq_items),
    isFeatured: Boolean(row.is_featured),
    status: row.status === "draft" ? "draft" : "published",
    sortOrder: Number(row.sort_order ?? 0)
  };
}

export function mapPostRow(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    type: row.type === "guide" || row.type === "notice" ? row.type : "event",
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    body: String(row.body ?? ""),
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    ctaLabel: row.cta_label ? String(row.cta_label) : undefined,
    relatedProductSlugs: asStringArray(row.related_product_slugs),
    isFeatured: Boolean(row.is_featured),
    publishedAt: String(row.published_at ?? ""),
    status: row.status === "draft" ? "draft" : "published"
  };
}

export function mapReviewRow(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    body: String(row.body ?? ""),
    reviewType:
      row.review_type === "internet_only" ||
      row.review_type === "moving" ||
      row.review_type === "bundle" ||
      row.review_type === "renewal"
        ? row.review_type
        : "internet_tv",
    tags: asStringArray(row.tags),
    featured: Boolean(row.featured),
    publishedAt: String(row.published_at ?? ""),
    status: row.status === "draft" ? "draft" : "published"
  };
}

function mapDesignSettingsJson(value: unknown): DesignSettings {
  const d = asKeyValue(value);
  return {
    heroFontSize: d.heroFontSize ?? "55px",
    headingFontSize: d.headingFontSize ?? "32px",
    bodyFontSize: d.bodyFontSize ?? "16px",
    buttonFontSize: d.buttonFontSize ?? "14px",
    buttonRadius: d.buttonRadius ?? "16px",
    sectionPadding: d.sectionPadding ?? "48px",
    primaryColor: d.primaryColor ?? "#4A86CF",
    primaryDarkColor: d.primaryDarkColor ?? "#3A74B8",
    heroBgColor: d.heroBgColor ?? "#4A86CF",
    sectionBgColor: d.sectionBgColor ?? "#D6E4F5",
    ctaBgColor: d.ctaBgColor ?? "#333333"
  };
}

export function mapSiteSettingsRow(row: Record<string, unknown>): SiteSettings {
  const businessInfo = asKeyValue(row.business_info_json);

  return {
    siteName: String(row.site_name ?? "인터넷공룡"),
    phoneLabel: String(row.phone_label ?? "1544-2825"),
    phoneLink: String(row.phone_link ?? "tel:15442825"),
    heroCtaLabel: String(row.hero_cta_label ?? "30초 상담 받기"),
    secondaryCtaLabel: String(row.secondary_cta_label ?? "전화 상담"),
    heroTitle: String(row.hero_title ?? "이번달 최대로 남김없이!"),
    heroAmount: String(row.hero_amount ?? "150만원"),
    heroSubtitle: String(row.hero_subtitle ?? "당일설치! 당일입금!"),
    footerNotice: String(row.footer_notice ?? ""),
    businessInfo: {
      owner: businessInfo.owner ?? "인터넷공룡",
      businessNumber: businessInfo.businessNumber ?? businessInfo.business_number ?? "",
      ecommerceNumber: businessInfo.ecommerceNumber ?? businessInfo.ecommerce_number ?? "",
      address: businessInfo.address ?? "",
      email: businessInfo.email ?? ""
    },
    designSettings: row.design_settings_json ? mapDesignSettingsJson(row.design_settings_json) : undefined
  };
}

export function mapInquiryRow(row: Record<string, unknown>): InquiryRecord {
  return {
    id: String(row.id),
    inquiryType: row.inquiry_type === "product" || row.inquiry_type === "apply" ? row.inquiry_type : "quick",
    name: String(row.name),
    phone: String(row.phone),
    productId: row.product_id ? String(row.product_id) : null,
    carrierSlug: row.carrier_slug ? String(row.carrier_slug) : null,
    sourcePage: String(row.source_page),
    status:
      row.status === "pending" ||
      row.status === "contacted" ||
      row.status === "retry" ||
      row.status === "consulted" ||
      row.status === "in_progress" ||
      row.status === "closed"
        ? row.status
        : "new",
    privacyAgreed: Boolean(row.privacy_agreed),
    regionLabel: row.region_label ? String(row.region_label) : null,
    contactTimePreference: row.contact_time_preference ? String(row.contact_time_preference) : null,
    payload: asUnknownRecord(row.payload_json),
    utm: asUnknownRecord(row.utm_json),
    adminMemo: row.admin_memo ? String(row.admin_memo) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}
