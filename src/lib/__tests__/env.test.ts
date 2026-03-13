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

  it("ignores blank optional env placeholders in development", () => {
    const env = {
      NODE_ENV: "development",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      KV_REST_API_URL: "",
      KV_REST_API_TOKEN: "",
      NEXT_PUBLIC_SITE_URL: ""
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(true);
  });

  it("ignores blank optional rate limit placeholders in production", () => {
    const env = {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      KV_REST_API_URL: "",
      KV_REST_API_TOKEN: ""
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(true);
  });

  it("accepts Vercel KV compatibility env keys", () => {
    const env = {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      KV_REST_API_URL: "https://example.upstash.io",
      KV_REST_API_TOKEN: "token"
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(true);
  });

  it("rejects partial Upstash env pairs", () => {
    const env = {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
      UPSTASH_REDIS_REST_URL: "https://example.upstash.io"
    };

    const result = createEnvSchema(env).safeParse(env);

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected validation to fail when only one Upstash env key is configured.");
    }

    expect(result.error.flatten().fieldErrors.UPSTASH_REDIS_REST_TOKEN).toEqual(expect.any(Array));
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
