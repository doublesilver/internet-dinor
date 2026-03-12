import { describe, expect, it } from "vitest";
import { createEnvSchema } from "@/lib/env";

describe("createEnvSchema", () => {
  it("does not require ADMIN_SESSION_SECRET when Supabase public env is configured", () => {
    const env = {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key"
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(true);
  });

  it("accepts optional Upstash env keys", () => {
    const env = {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "token"
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(true);
  });

  it("still requires ADMIN_SESSION_SECRET in production preview mode", () => {
    const env = {
      NODE_ENV: "production",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key"
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected validation to fail when Supabase public env is missing.");
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    expect(fieldErrors.ADMIN_SESSION_SECRET).toEqual(expect.any(Array));
    expect(fieldErrors.NEXT_PUBLIC_SUPABASE_URL).toEqual(expect.any(Array));
    expect(fieldErrors.NEXT_PUBLIC_SUPABASE_ANON_KEY).toEqual(expect.any(Array));
  });
});
