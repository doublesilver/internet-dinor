import { z } from "zod";

const envSchema = z.object({
  ADMIN_PREVIEW_EMAIL: z.string().optional(),
  ADMIN_PREVIEW_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
  ADMIN_ALLOWED_EMAILS: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional()
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("[env] 환경변수 검증 실패:", result.error.flatten().fieldErrors);
    throw new Error("환경변수 설정이 올바르지 않습니다. 로그를 확인해주세요.");
  }

  return result.data;
}
