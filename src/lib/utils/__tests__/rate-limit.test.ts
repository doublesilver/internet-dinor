import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Reset module state between tests
let isRateLimited: typeof import("../rate-limit").isRateLimited;
let getRateLimitKey: typeof import("../rate-limit").getRateLimitKey;
let hasUpstashRateLimitEnv: typeof import("../rate-limit").hasUpstashRateLimitEnv;

beforeEach(async () => {
  vi.resetModules();
  vi.unstubAllEnvs();
  const mod = await import("../rate-limit");
  isRateLimited = mod.isRateLimited;
  getRateLimitKey = mod.getRateLimitKey;
  hasUpstashRateLimitEnv = mod.hasUpstashRateLimitEnv;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("isRateLimited", () => {
  it("allows requests within the limit", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(isRateLimited("test-key", 5, 60_000)).resolves.toBe(false);
    }
  });

  it("blocks requests exceeding the limit", async () => {
    for (let i = 0; i < 5; i++) {
      await isRateLimited("test-key", 5, 60_000);
    }
    await expect(isRateLimited("test-key", 5, 60_000)).resolves.toBe(true);
  });

  it("resets after the time window expires", async () => {
    vi.useFakeTimers();

    for (let i = 0; i < 5; i++) {
      await isRateLimited("test-key", 5, 1_000);
    }
    await expect(isRateLimited("test-key", 5, 1_000)).resolves.toBe(true);

    vi.advanceTimersByTime(1_001);
    await expect(isRateLimited("test-key", 5, 1_000)).resolves.toBe(false);

    vi.useRealTimers();
  });

  it("tracks different keys independently", async () => {
    for (let i = 0; i < 5; i++) {
      await isRateLimited("key-a", 5, 60_000);
    }
    await expect(isRateLimited("key-a", 5, 60_000)).resolves.toBe(true);
    await expect(isRateLimited("key-b", 5, 60_000)).resolves.toBe(false);
  });

  it("falls back to in-memory limits when Upstash credentials are missing", async () => {
    expect(hasUpstashRateLimitEnv()).toBe(false);

    await expect(isRateLimited("fallback-key", 1, 60_000)).resolves.toBe(false);
    await expect(isRateLimited("fallback-key", 1, 60_000)).resolves.toBe(true);
  });

  it("uses the Upstash limiter when env keys are configured", async () => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    const limitMock = vi.fn().mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60_000,
      pending: Promise.resolve()
    });
    const slidingWindowMock = vi.fn().mockReturnValue("window");
    const constructorMock = vi.fn(function MockRatelimit() {
      return {
        limit: limitMock
      };
    });
    const fromEnvMock = vi.fn().mockReturnValue({});

    vi.doMock("@upstash/redis", () => ({
      Redis: {
        fromEnv: fromEnvMock
      }
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: Object.assign(constructorMock, {
        slidingWindow: slidingWindowMock
      })
    }));

    const mod = await import("../rate-limit");

    await expect(mod.isRateLimited("distributed-key", 5, 60_000)).resolves.toBe(true);
    await expect(mod.isRateLimited("distributed-key", 5, 60_000)).resolves.toBe(true);

    expect(fromEnvMock).toHaveBeenCalledTimes(1);
    expect(slidingWindowMock).toHaveBeenCalledWith(5, "60000ms");
    expect(constructorMock).toHaveBeenCalledTimes(1);
    expect(limitMock).toHaveBeenCalledTimes(2);
  });

  it("falls back to memory limits when the Upstash request fails", async () => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const limitMock = vi.fn().mockRejectedValue(new Error("upstash unavailable"));
    const fromEnvMock = vi.fn().mockReturnValue({});

    vi.doMock("@upstash/redis", () => ({
      Redis: {
        fromEnv: fromEnvMock
      }
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: Object.assign(
        vi.fn(function MockRatelimit() {
          return {
            limit: limitMock
          };
        }),
        {
          slidingWindow: vi.fn().mockReturnValue("window")
        }
      )
    }));

    const mod = await import("../rate-limit");

    await expect(mod.isRateLimited("fallback-key", 2, 60_000)).resolves.toBe(false);
    await expect(mod.isRateLimited("fallback-key", 2, 60_000)).resolves.toBe(false);
    await expect(mod.isRateLimited("fallback-key", 2, 60_000)).resolves.toBe(true);

    expect(fromEnvMock).toHaveBeenCalledTimes(1);
    expect(limitMock).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});

describe("getRateLimitKey", () => {
  it("prefers x-real-ip when available", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9", "x-forwarded-for": "1.2.3.4, 5.6.7.8" }
    });
    expect(getRateLimitKey(request, "test")).toBe("test:9.9.9.9");
  });

  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" }
    });
    expect(getRateLimitKey(request, "test")).toBe("test:1.2.3.4");
  });

  it("uses 'unknown' when no forwarded header", () => {
    const request = new Request("http://localhost");
    expect(getRateLimitKey(request, "test")).toBe("test:unknown");
  });
});

describe("hasUpstashRateLimitEnv", () => {
  it("detects Upstash env keys", async () => {
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = "https://example.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token";

    const mod = await import("../rate-limit");
    expect(mod.hasUpstashRateLimitEnv()).toBe(true);
  });

  it("detects Vercel KV compatibility env keys", async () => {
    vi.resetModules();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.KV_REST_API_URL = "https://example.com";
    process.env.KV_REST_API_TOKEN = "token";

    const mod = await import("../rate-limit");
    expect(mod.hasUpstashRateLimitEnv()).toBe(true);
  });
});
