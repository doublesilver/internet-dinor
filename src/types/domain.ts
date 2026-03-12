export type ContentStatus = "draft" | "published";
export type PostType = "event" | "guide" | "notice";
export type ReviewType = "internet_only" | "internet_tv" | "moving" | "bundle" | "renewal";
export type ProductBundleType = "internet_only" | "internet_tv" | "business" | "custom";
export type InquiryType = "quick" | "product" | "apply";
export type InquiryStatus = "new" | "pending" | "contacted" | "retry" | "consulted" | "in_progress" | "closed";

export interface Carrier {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  heroTitle: string;
  heroDescription: string;
  featurePoints: string[];
  status: ContentStatus;
  sortOrder: number;
}

export interface Product {
  id: string;
  carrierId: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  bundleType: ProductBundleType;
  internetSpeed: string;
  tvIncluded: boolean;
  monthlyPriceLabel: string;
  benefitLabel: string;
  badgeTags: string[];
  targetTags: string[];
  heroPoints: string[];
  detailSections: Array<{ title: string; body: string }>;
  faqItems: Array<{ q: string; a: string }>;
  isFeatured: boolean;
  status: ContentStatus;
  sortOrder: number;
}

export interface Post {
  id: string;
  type: PostType;
  slug: string;
  title: string;
  summary: string;
  body: string;
  thumbnailUrl?: string;
  ctaLabel?: string;
  relatedProductSlugs: string[];
  isFeatured: boolean;
  publishedAt: string;
  status: ContentStatus;
}

export interface Review {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  reviewType: ReviewType;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  status: ContentStatus;
}

export interface SiteSettings {
  siteName: string;
  phoneLabel: string;
  phoneLink: string;
  heroCtaLabel: string;
  secondaryCtaLabel: string;
  footerNotice: string;
  businessInfo: {
    owner: string;
    businessNumber: string;
    address: string;
    email: string;
  };
}

export interface InquiryRecord {
  id: string;
  inquiryType: InquiryType;
  name: string;
  phone: string;
  productId?: string | null;
  carrierSlug?: string | null;
  sourcePage: string;
  status: InquiryStatus;
  privacyAgreed: boolean;
  regionLabel?: string | null;
  contactTimePreference?: string | null;
  payload: Record<string, unknown>;
  utm: Record<string, unknown>;
  adminMemo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryCreateInput {
  inquiryType: InquiryType;
  name: string;
  phone: string;
  sourcePage: string;
  privacyAgreed: boolean;
  productId?: string | null;
  carrierSlug?: string | null;
  regionLabel?: string | null;
  contactTimePreference?: string | null;
  payload?: Record<string, unknown>;
  utm?: Record<string, unknown>;
}
