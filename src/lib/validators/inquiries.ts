import { z } from "zod";

const phoneRule = z
  .string()
  .min(9, "연락처를 입력해주세요.")
  .refine((value) => value.replace(/\D/g, "").length >= 10, "올바른 연락처를 입력해주세요.");

const privacyRule = z.boolean().refine((value) => value === true, {
  message: "개인정보 수집 동의가 필요합니다."
});

const utmSchema = z
  .record(z.string().max(200))
  .optional()
  .refine((value) => !value || JSON.stringify(value).length <= 2000, {
    message: "UTM 데이터가 너무 큽니다."
  });

const payloadSchema = z
  .record(z.string().max(200))
  .optional()
  .refine((value) => !value || JSON.stringify(value).length <= 2000, {
    message: "페이로드 데이터가 너무 큽니다."
  });

export const quickInquirySchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  privacyAgreed: privacyRule,
  sourcePage: z.string().min(1),
  utm: utmSchema
});

export const productInquirySchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  productSlug: z.string().min(1),
  sourcePage: z.string().min(1),
  privacyAgreed: privacyRule,
  regionLabel: z.string().optional(),
  contactTimePreference: z.string().optional(),
  payload: payloadSchema,
  utm: utmSchema
});

export const applyInquirySchema = z.object({
  name: z.string().min(2, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  email: z.string().email("올바른 이메일을 입력해주세요.").optional().or(z.literal("")),
  sourcePage: z.string().min(1),
  privacyAgreed: privacyRule,
  termsAgreed: z.boolean().refine((v) => v === true, { message: "이용약관 동의가 필요합니다." }),
  regionLabel: z.string().optional(),
  contactTimePreference: z.string().optional(),
  payload: payloadSchema,
  utm: utmSchema
});

export type QuickInquiryValues = z.infer<typeof quickInquirySchema>;
export type ProductInquiryValues = z.infer<typeof productInquirySchema>;
export type ApplyInquiryValues = z.infer<typeof applyInquirySchema>;
