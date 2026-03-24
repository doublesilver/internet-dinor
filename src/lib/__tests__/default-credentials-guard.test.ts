import { describe, expect, it } from "vitest";
import { createEnvSchema } from "@/lib/env";

// C-3: 기본 인증값(change-me 등)이 프로덕션에서 그대로 사용되는 경우를 탐지
// 현재 env 스키마가 기본값 패턴을 직접 검증하지 않으므로
// 애플리케이션 레이어에서 기본값 탐지 함수를 기대한다.

const DEFAULT_PLACEHOLDER_PATTERNS = [
  "change-me",
  "changeme",
  "change_me",
  "secret",
  "your-secret",
];

function containsDefaultPlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return DEFAULT_PLACEHOLDER_PATTERNS.some((pattern) =>
    lower.includes(pattern),
  );
}

describe("기본 인증값 가드", () => {
  it("유효한 ADMIN_SESSION_SECRET은 플레이스홀더 패턴을 포함하지 않는다", () => {
    const validSecret = "a".repeat(32);
    expect(containsDefaultPlaceholder(validSecret)).toBe(false);
  });

  it("'change-me'가 포함된 시크릿은 플레이스홀더로 탐지한다", () => {
    expect(
      containsDefaultPlaceholder("change-me-please-32chars-minimum!!"),
    ).toBe(true);
  });

  it("'changeme'가 포함된 시크릿은 플레이스홀더로 탐지한다", () => {
    expect(containsDefaultPlaceholder("changeme123456789012345678901234")).toBe(
      true,
    );
  });

  it("'your-secret'이 포함된 시크릿은 플레이스홀더로 탐지한다", () => {
    expect(
      containsDefaultPlaceholder("your-secret-key-32chars-minimum!!"),
    ).toBe(true);
  });

  it("env 스키마는 프로덕션에서 ADMIN_SESSION_SECRET 최소 32자를 요구한다", () => {
    const env = {
      NODE_ENV: "production",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      // NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 없음 → preview 모드
      // → ADMIN_SESSION_SECRET 필요
    };

    const shortSecret = { ...env, ADMIN_SESSION_SECRET: "short" };
    const result = createEnvSchema(shortSecret).safeParse(shortSecret);

    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.ADMIN_SESSION_SECRET).toEqual(expect.any(Array));
    }
  });

  it("env 스키마는 32자 이상의 ADMIN_SESSION_SECRET을 허용한다", () => {
    const validSecret = "a".repeat(32);
    const env = {
      NODE_ENV: "production",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      ADMIN_SESSION_SECRET: validSecret,
    };

    const result = createEnvSchema(env).safeParse(env);

    // NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 없어서 별도 에러 존재하지만
    // ADMIN_SESSION_SECRET 자체는 통과해야 한다
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.ADMIN_SESSION_SECRET).toBeUndefined();
    }
  });

  it("'change-me' 32자 이상 시크릿은 길이 조건은 통과하지만 기본값으로 탐지된다", () => {
    const defaultLikeSecret = "change-me-this-is-32-chars-long!!";
    expect(defaultLikeSecret.length).toBeGreaterThanOrEqual(32);
    expect(containsDefaultPlaceholder(defaultLikeSecret)).toBe(true);
  });
});
