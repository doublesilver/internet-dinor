import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// W-1: Upstash 장애 시 프로덕션에서 fail-closed(요청 차단) 동작 확인

let isRateLimited: typeof import("../rate-limit").isRateLimited;

beforeEach(async () => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("W-1: Rate limit fail-closed 동작", () => {
  it("Upstash 설정 없이 인메모리 한도 초과 시 요청을 차단한다", async () => {
    const mod = await import("../rate-limit");
    isRateLimited = mod.isRateLimited;

    // limit=1, 윈도우 1분: 2번째 요청부터 차단
    await expect(isRateLimited("fail-closed-key", 1, 60_000)).resolves.toBe(
      false,
    );
    await expect(isRateLimited("fail-closed-key", 1, 60_000)).resolves.toBe(
      true,
    );
  });

  it("Upstash 응답 실패 시 인메모리 폴백으로 한도를 계속 추적한다", async () => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
    const limitMock = vi
      .fn()
      .mockRejectedValue(new Error("upstash connection refused"));

    vi.doMock("@upstash/redis", () => ({
      Redis: vi.fn(function MockRedis() {
        return {};
      }),
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: Object.assign(
        vi.fn(function MockRatelimit() {
          return { limit: limitMock };
        }),
        { slidingWindow: vi.fn().mockReturnValue("window") },
      ),
    }));

    const mod = await import("../rate-limit");

    // Upstash 실패 → 인메모리 폴백 (limit=2)
    await expect(mod.isRateLimited("w1-key", 2, 60_000)).resolves.toBe(false);
    await expect(mod.isRateLimited("w1-key", 2, 60_000)).resolves.toBe(false);
    // 인메모리로 한도 초과 → 차단
    await expect(mod.isRateLimited("w1-key", 2, 60_000)).resolves.toBe(true);

    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("Upstash가 차단 신호를 반환하면 요청을 차단한다", async () => {
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    const limitMock = vi.fn().mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    });

    vi.doMock("@upstash/redis", () => ({
      Redis: vi.fn(function MockRedis() {
        return {};
      }),
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: Object.assign(
        vi.fn(function MockRatelimit() {
          return { limit: limitMock };
        }),
        { slidingWindow: vi.fn().mockReturnValue("window") },
      ),
    }));

    const mod = await import("../rate-limit");

    await expect(
      mod.isRateLimited("upstash-blocked-key", 5, 60_000),
    ).resolves.toBe(true);
  });

  it("Upstash 폴백 쿨다운 이후 재연결을 시도한다", async () => {
    vi.useFakeTimers();
    vi.resetModules();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");

    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const failingLimit = vi.fn().mockRejectedValue(new Error("down"));
    const successLimit = vi.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 60_000,
      pending: Promise.resolve(),
    });
    let callCount = 0;
    const constructorMock = vi.fn(function MockRatelimit() {
      callCount += 1;
      return { limit: callCount === 1 ? failingLimit : successLimit };
    });
    const redisConstructorMock = vi.fn(function MockRedis() {
      return {};
    });

    vi.doMock("@upstash/redis", () => ({
      Redis: redisConstructorMock,
    }));
    vi.doMock("@upstash/ratelimit", () => ({
      Ratelimit: Object.assign(constructorMock, {
        slidingWindow: vi.fn().mockReturnValue("window"),
      }),
    }));

    const mod = await import("../rate-limit");

    // 첫 요청: Upstash 실패 → 폴백
    await mod.isRateLimited("reconnect-key", 5, 60_000);
    expect(redisConstructorMock).toHaveBeenCalledTimes(1);

    // 쿨다운(60초) 이전에는 재시도 안 함
    vi.advanceTimersByTime(30_000);
    await mod.isRateLimited("reconnect-key-2", 5, 60_000);
    expect(redisConstructorMock).toHaveBeenCalledTimes(1);

    // 쿨다운 이후 재연결
    vi.advanceTimersByTime(30_001);
    await mod.isRateLimited("reconnect-key-3", 5, 60_000);
    expect(redisConstructorMock).toHaveBeenCalledTimes(2);
  });
});
