import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const envSchema = z.object({
  ADMIN_PREVIEW_EMAIL: z.string().optional(),
  ADMIN_PREVIEW_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: isProduction ? z.string().min(32) : z.string().min(1).optional(),
  ADMIN_ALLOWED_EMAILS: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: isProduction ? z.string().url() : z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isProduction ? z.string().min(1) : z.string().min(1).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: isProduction ? z.string().min(1) : z.string().min(1).optional(),
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
