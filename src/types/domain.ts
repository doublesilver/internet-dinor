export type ContentStatus = "draft" | "published" | "pending";
export type ReviewSource = "admin" | "customer";
export type PostType = "event" | "guide" | "notice";
export type ReviewType =
  | "internet_only"
  | "internet_tv"
  | "moving"
  | "bundle"
  | "renewal";
export type ProductBundleType =
  | "internet_only"
  | "internet_tv"
  | "business"
  | "custom";
export type InquiryType = "quick" | "product" | "apply";
export type InquiryStatus =
  | "new"
  | "pending"
  | "contacted"
  | "retry"
  | "consulted"
  | "in_progress"
  | "closed";

export interface CarrierInternetOption {
  label: string;
  speed: string;
  price: number;
}

export interface CarrierTvOption {
  label: string;
  price: number;
}

export interface CarrierMobileOption {
  label: string;
  discount: number;
}

export interface CarrierPriceData {
  internetOptions: CarrierInternetOption[];
  tvOptions: CarrierTvOption[];
  mobileOptions: CarrierMobileOption[];
}

export interface Carrier {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  heroTitle: string;
  heroDescription: string;
  featurePoints: string[];
  priceData?: CarrierPriceData;
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
  originalPriceLabel?: string;
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
  authorName?: string;
  source?: ReviewSource;
  publishedAt: string;
  status: ContentStatus;
}

export interface DesignSettings {
  // 히어로 섹션 (메인 상단 파란 영역)
  hero_bgColor: string;
  hero_titleFontSize: string;
  hero_titleColor: string;
  hero_subtitleFontSize: string;
  hero_subtitleColor: string;

  // 통신사 대표 상품 섹션
  carrierProducts_bgColor: string;
  carrierProducts_headingFontSize: string;
  carrierProducts_headingColor: string;

  // 혜택 구성별 섹션
  benefits_bgColor: string;
  benefits_headingFontSize: string;
  benefits_headingColor: string;

  // CTA 배너 ("혜택이 이렇게나 많았다고?")
  cta_bgColor: string;
  cta_headingFontSize: string;
  cta_headingColor: string;

  // 실시간 신청 현황 섹션
  recent_headingFontSize: string;
  recent_headingColor: string;

  // 꿀TIP 섹션
  tips_bgColor: string;
  tips_headingFontSize: string;
  tips_headingColor: string;

  // 통신사 메뉴 (헤더 서브 네비게이션)
  carrierNav_fontSize: string;
  carrierNav_height: string;

  // 버튼 공통
  button_fontSize: string;
  button_radius: string;
  button_primaryColor: string;
  button_primaryDarkColor: string;

  // 섹션 공통
  section_padding: string;
}

export interface SiteSettings {
  siteName: string;
  phoneLabel: string;
  phoneLink: string;
  heroCtaLabel: string;
  secondaryCtaLabel: string;
  heroTitle: string;
  heroAmount: string;
  heroSubtitle: string;
  footerNotice: string;
  businessInfo: {
    owner: string;
    businessNumber: string;
    ecommerceNumber: string;
    address: string;
    email: string;
  };
  designSettings?: DesignSettings;
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
