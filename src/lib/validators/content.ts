import { z } from "zod";

const statusSchema = z.enum(["draft", "published"]);

const slugSchema = z
  .string()
  .min(1, "슬러그를 입력해주세요.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다.");

export const carrierEditorSchema = z.object({
  name: z.string().min(1, "통신사명을 입력해주세요."),
  shortName: z.string().min(1, "약칭을 입력해주세요."),
  slug: slugSchema,
  summary: z.string().min(1, "요약을 입력해주세요.").max(5000, "요약은 5000자 이하로 입력해주세요."),
  heroTitle: z.string().min(1, "히어로 제목을 입력해주세요."),
  heroDescription: z.string().min(1, "히어로 설명을 입력해주세요."),
  featurePointsText: z.string().optional().default(""),
  status: statusSchema,
  sortOrder: z.coerce.number().int().default(0)
});

export const contentStatusSchema = z.object({
  status: statusSchema
});

export const postReviewStatusSchema = contentStatusSchema.extend({
  entityType: z.enum(["post", "review"])
});

export const productEditorSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요."),
  slug: slugSchema,
  summary: z.string().min(1, "요약을 입력해주세요.").max(5000, "요약은 5000자 이하로 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요.").max(10000, "설명은 10000자 이하로 입력해주세요."),
  carrierId: z.string().min(1, "통신사를 선택해주세요."),
  bundleType: z.enum(["internet_only", "internet_tv", "business", "custom"]),
  internetSpeed: z.string().min(1, "속도를 입력해주세요."),
  monthlyPriceLabel: z.string().min(1, "요금 문구를 입력해주세요."),
  originalPriceLabel: z.string().optional(),
  benefitLabel: z.string().min(1, "혜택 문구를 입력해주세요."),
  badgeTagsText: z.string().optional().default(""),
  targetTagsText: z.string().optional().default(""),
  heroPointsText: z.string().optional().default(""),
  detailSectionsText: z.string().optional().default(""),
  faqItemsText: z.string().optional().default(""),
  tvIncluded: z.boolean(),
  isFeatured: z.boolean(),
  status: statusSchema,
  sortOrder: z.coerce.number().int().default(0)
});

export const postEditorSchema = z.object({
  entityType: z.enum(["post", "review"]),
  type: z.enum(["event", "guide", "notice"]).optional(),
  reviewType: z.enum(["internet_only", "internet_tv", "moving", "bundle", "renewal"]).optional(),
  title: z.string().min(1, "제목을 입력해주세요."),
  slug: slugSchema,
  summary: z.string().min(1, "요약을 입력해주세요.").max(5000, "요약은 5000자 이하로 입력해주세요."),
  body: z.string().min(1, "본문을 입력해주세요.").max(100000, "본문은 100000자 이하로 입력해주세요."),
  ctaLabel: z.string().optional().default(""),
  relatedProductSlugsText: z.string().optional().default(""),
  tagsText: z.string().optional().default(""),
  isFeatured: z.boolean(),
  status: statusSchema,
  publishedAt: z.string().min(1, "게시일을 입력해주세요.")
});

export const designSettingsSchema = z.object({
  hero_bgColor: z.string().optional().default("#4A86CF"),
  hero_titleFontSize: z.string().optional().default("55px"),
  hero_titleColor: z.string().optional().default("#ffffff"),
  hero_subtitleFontSize: z.string().optional().default("18px"),
  hero_subtitleColor: z.string().optional().default("rgba(255,255,255,0.85)"),

  carrierProducts_bgColor: z.string().optional().default("#D6E4F5"),
  carrierProducts_headingFontSize: z.string().optional().default("32px"),
  carrierProducts_headingColor: z.string().optional().default("#4A86CF"),

  benefits_bgColor: z.string().optional().default("#6EA8E0"),
  benefits_headingFontSize: z.string().optional().default("32px"),
  benefits_headingColor: z.string().optional().default("#ffffff"),

  cta_bgColor: z.string().optional().default("#333333"),
  cta_headingFontSize: z.string().optional().default("32px"),
  cta_headingColor: z.string().optional().default("#ffffff"),

  recent_headingFontSize: z.string().optional().default("32px"),
  recent_headingColor: z.string().optional().default("#2C3E50"),

  tips_bgColor: z.string().optional().default("#F5F8FC"),
  tips_headingFontSize: z.string().optional().default("32px"),
  tips_headingColor: z.string().optional().default("#2C3E50"),

  button_fontSize: z.string().optional().default("14px"),
  button_radius: z.string().optional().default("16px"),
  button_primaryColor: z.string().optional().default("#4A86CF"),
  button_primaryDarkColor: z.string().optional().default("#3A74B8"),

  section_padding: z.string().optional().default("48px")
});

export const settingsEditorSchema = z.object({
  siteName: z.string().min(1, "사이트명을 입력해주세요."),
  phoneLabel: z.string().min(1, "대표번호를 입력해주세요."),
  phoneLink: z.string().min(1, "전화 링크를 입력해주세요."),
  heroCtaLabel: z.string().min(1, "메인 CTA를 입력해주세요."),
  secondaryCtaLabel: z.string().min(1, "보조 CTA를 입력해주세요."),
  heroTitle: z.string().optional(),
  heroAmount: z.string().optional(),
  heroSubtitle: z.string().optional(),
  footerNotice: z.string().min(1, "푸터 문구를 입력해주세요."),
  owner: z.string().min(1, "대표자 또는 상호명을 입력해주세요."),
  businessNumber: z.string().min(1, "사업자등록번호를 입력해주세요."),
  ecommerceNumber: z.string().optional().default(""),
  address: z.string().min(1, "주소를 입력해주세요."),
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  designSettings: designSettingsSchema.optional()
});

export type CarrierEditorValues = z.infer<typeof carrierEditorSchema>;
export type ProductEditorValues = z.infer<typeof productEditorSchema>;
export type PostEditorValues = z.infer<typeof postEditorSchema>;
export type SettingsEditorValues = z.infer<typeof settingsEditorSchema>;
export type DesignSettingsValues = z.infer<typeof designSettingsSchema>;
export type ContentStatusValues = z.infer<typeof contentStatusSchema>;
export type PostReviewStatusValues = z.infer<typeof postReviewStatusSchema>;
