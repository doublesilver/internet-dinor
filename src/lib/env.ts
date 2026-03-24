import { z } from "zod";
import { getUpstashRateLimitEnvIssues } from "@/lib/utils/rate-limit-config";

type EnvShape = Record<string, string | undefined>;

function emptyStringToUndefined(value: unknown) {
  return value === "" ? undefined : value;
}

function isProductionEnv(env: EnvShape) {
  return env.NODE_ENV === "production";
}

function hasSupabasePublicEnv(env: EnvShape) {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createEnvSchema(env: EnvShape = process.env) {
  const isProduction = isProductionEnv(env);
  const requiresPreviewSessionSecret =
    isProduction && !hasSupabasePublicEnv(env);
  const optionalUrl = z.preprocess(
    emptyStringToUndefined,
    z.string().url().optional(),
  );
  const optionalText = z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional(),
  );

  return z
    .object({
      ADMIN_PREVIEW_EMAIL: optionalText,
      ADMIN_PREVIEW_PASSWORD: optionalText,
      ADMIN_SESSION_SECRET: requiresPreviewSessionSecret
        ? z.string().min(32)
        : optionalText,
      ADMIN_ALLOWED_EMAILS: optionalText,
      NEXT_PUBLIC_SUPABASE_URL: isProduction ? z.string().url() : optionalUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: isProduction
        ? z.string().min(1)
        : optionalText,
      SUPABASE_URL: optionalUrl,
      SUPABASE_SERVICE_ROLE_KEY: isProduction
        ? z.string().min(1)
        : optionalText,
      UPSTASH_REDIS_REST_URL: optionalUrl,
      UPSTASH_REDIS_REST_TOKEN: optionalText,
      KV_REST_API_URL: optionalUrl,
      KV_REST_API_TOKEN: optionalText,
      NEXT_PUBLIC_SITE_URL: optionalUrl,
    })
    .superRefine((parsedEnv, ctx) => {
      if (isProduction) {
        if (parsedEnv.ADMIN_PREVIEW_PASSWORD?.includes("change-me")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ADMIN_PREVIEW_PASSWORD"],
            message:
              "프로덕션 환경에서 기본 비밀번호(change-me)를 사용할 수 없습니다.",
          });
        }
        if (parsedEnv.ADMIN_SESSION_SECRET?.includes("change-me")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ADMIN_SESSION_SECRET"],
            message:
              "프로덕션 환경에서 기본 세션 시크릿(change-me)을 사용할 수 없습니다.",
          });
        }
      }

      for (const issue of getUpstashRateLimitEnvIssues(parsedEnv)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [issue.key],
          message: issue.message,
        });
      }
    });
}

export function validateEnv(env: EnvShape = process.env) {
  if (env.SKIP_ENV_VALIDATION === "true") {
    return env as Record<string, string | undefined>;
  }

  const result = createEnvSchema(env).safeParse(env);

  if (!result.success) {
    console.error(
      "[env] 환경변수 검증 실패:",
      result.error.flatten().fieldErrors,
    );
    throw new Error("환경변수 설정이 올바르지 않습니다. 로그를 확인해주세요.");
  }

  return result.data;
}
