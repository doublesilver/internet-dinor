import { z } from "zod";
import { APPLY_INQUIRY_PAYLOAD_KEYS, PRODUCT_INQUIRY_PAYLOAD_KEYS } from "@/lib/utils/inquiry-form";

const textRule = (max: number) => z.string().trim().max(max, `${max}자 이하로 입력해주세요.`);
const requiredTextRule = (min: number, max: number, message: string) =>
  z.string().trim().min(min, message).max(max, `${max}자 이하로 입력해주세요.`);
const optionalTextRule = (max: number) => textRule(max).optional().or(z.literal(""));

const phoneRule = z
  .string()
  .min(9, "연락처를 입력해주세요.")
  .max(20, "연락처를 확인해주세요.")
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

function createPayloadSchema(allowedKeys: readonly string[]) {
  return z
    .record(z.string().max(200))
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      const filteredEntries = Object.entries(value)
        .filter(([key]) => allowedKeys.includes(key))
        .map(([key, item]) => [key, item.trim()]);

      if (filteredEntries.length === 0) {
        return undefined;
      }

      return Object.fromEntries(filteredEntries) as Record<string, string>;
    })
    .refine((value) => !value || JSON.stringify(value).length <= 2000, {
      message: "페이로드 데이터가 너무 큽니다."
    });
}

export const applyInquiryPayloadSchema = createPayloadSchema(APPLY_INQUIRY_PAYLOAD_KEYS);

const productPayloadSchema = createPayloadSchema(PRODUCT_INQUIRY_PAYLOAD_KEYS);

export const quickInquirySchema = z.object({
  name: requiredTextRule(2, 50, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  privacyAgreed: privacyRule,
  sourcePage: requiredTextRule(1, 200, "유입 경로를 확인해주세요."),
  utm: utmSchema
});

export const productInquirySchema = z.object({
  name: requiredTextRule(2, 50, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  productSlug: requiredTextRule(1, 150, "상품 정보를 확인해주세요."),
  sourcePage: requiredTextRule(1, 200, "유입 경로를 확인해주세요."),
  privacyAgreed: privacyRule,
  regionLabel: optionalTextRule(100),
  contactTimePreference: optionalTextRule(50),
  payload: productPayloadSchema,
  utm: utmSchema
});

export const applyInquirySchema = z.object({
  name: requiredTextRule(2, 50, "이름을 2자 이상 입력해주세요."),
  phone: phoneRule,
  sourcePage: requiredTextRule(1, 200, "유입 경로를 확인해주세요."),
  privacyAgreed: privacyRule,
  termsAgreed: z.boolean().refine((v) => v === true, { message: "이용약관 동의가 필요합니다." }),
  regionLabel: optionalTextRule(100),
  contactTimePreference: optionalTextRule(50),
  payload: applyInquiryPayloadSchema,
  utm: utmSchema
});

export type QuickInquiryValues = z.infer<typeof quickInquirySchema>;
export type ProductInquiryValues = z.infer<typeof productInquirySchema>;
export type ApplyInquiryPayload = z.infer<typeof applyInquiryPayloadSchema>;
export type ApplyInquiryValues = z.infer<typeof applyInquirySchema>;
