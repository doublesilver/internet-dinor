import { describe, expect, it, vi, beforeEach } from "vitest";

// Reset module state between tests
let isRateLimited: typeof import("../rate-limit").isRateLimited;
let getRateLimitKey: typeof import("../rate-limit").getRateLimitKey;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("../rate-limit");
  isRateLimited = mod.isRateLimited;
  getRateLimitKey = mod.getRateLimitKey;
});

describe("isRateLimited", () => {
  it("allows requests within the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited("test-key", 5, 60_000)).toBe(false);
    }
  });

  it("blocks requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      isRateLimited("test-key", 5, 60_000);
    }
    expect(isRateLimited("test-key", 5, 60_000)).toBe(true);
  });

  it("resets after the time window expires", () => {
    vi.useFakeTimers();

    for (let i = 0; i < 5; i++) {
      isRateLimited("test-key", 5, 1_000);
    }
    expect(isRateLimited("test-key", 5, 1_000)).toBe(true);

    vi.advanceTimersByTime(1_001);
    expect(isRateLimited("test-key", 5, 1_000)).toBe(false);

    vi.useRealTimers();
  });

  it("tracks different keys independently", () => {
    for (let i = 0; i < 5; i++) {
      isRateLimited("key-a", 5, 60_000);
    }
    expect(isRateLimited("key-a", 5, 60_000)).toBe(true);
    expect(isRateLimited("key-b", 5, 60_000)).toBe(false);
  });
});

describe("getRateLimitKey", () => {
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
