import { z } from "zod";

export const inquiryStatusValues = ["new", "pending", "contacted", "retry", "consulted", "in_progress", "closed"] as const;

export const updateInquirySchema = z
  .object({
    status: z.enum(inquiryStatusValues).optional(),
    adminMemo: z.string().max(5000, "메모는 5000자 이하로 입력해주세요.").optional()
  })
  .refine((value) => value.status !== undefined || value.adminMemo !== undefined, {
    message: "상태 또는 메모 중 하나는 필요합니다."
  });

export type UpdateInquiryValues = z.infer<typeof updateInquirySchema>;
