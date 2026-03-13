import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  RATE_LIMIT_PREFIX,
  RATE_LIMIT_RETRY_COOLDOWN_MS,
  hasUpstashRateLimitEnv as hasConfiguredUpstashRateLimitEnv,
  resolveUpstashRateLimitEnv
} from "@/lib/utils/rate-limit-config";

// Upstash가 설정되지 않았거나 일시 장애가 있을 때만 인메모리 폴백을 사용합니다.
const store = new Map<string, { count: number; resetAt: number }>();
const ephemeralCache = new Map<string, number>();
const ratelimiterCache = new Map<string, Ratelimit>();

const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();
let redisClient: Redis | null | undefined;
let distributedRateLimitRetryAfter = 0;
let lastRedisFallbackLogAt = 0;

function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

function isMemoryRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpired(now);

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;

  if (entry.count > limit) {
    return true;
  }

  return false;
}

export function hasUpstashRateLimitEnv(): boolean {
  return hasConfiguredUpstashRateLimitEnv();
}

function formatWindow(windowMs: number): `${number}ms` {
  return `${windowMs}ms`;
}

function isDistributedRateLimitCoolingDown(now: number): boolean {
  return now < distributedRateLimitRetryAfter;
}

function markDistributedRateLimitFailure(error: unknown) {
  const now = Date.now();
  distributedRateLimitRetryAfter = now + RATE_LIMIT_RETRY_COOLDOWN_MS;
  redisClient = undefined;
  ratelimiterCache.clear();

  if (now - lastRedisFallbackLogAt >= RATE_LIMIT_RETRY_COOLDOWN_MS) {
    lastRedisFallbackLogAt = now;
    console.warn("Upstash rate limit check failed. Falling back to in-memory store.", error);
  }
}

function getRedisClient(): Redis | null {
  const now = Date.now();

  if (isDistributedRateLimitCoolingDown(now)) {
    return null;
  }

  if (redisClient !== undefined) {
    return redisClient;
  }

  const upstashEnv = resolveUpstashRateLimitEnv();
  if (!upstashEnv) {
    redisClient = null;
    return redisClient;
  }

  try {
    redisClient = new Redis(upstashEnv);
  } catch (error) {
    markDistributedRateLimitFailure(error);
    redisClient = null;
  }

  return redisClient;
}

function getUpstashRatelimit(limit: number, windowMs: number): Ratelimit | null {
  if (isDistributedRateLimitCoolingDown(Date.now())) {
    return null;
  }

  const cacheKey = `${limit}:${windowMs}`;
  const cached = ratelimiterCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, formatWindow(windowMs)),
    analytics: true,
    prefix: RATE_LIMIT_PREFIX,
    ephemeralCache
  });

  ratelimiterCache.set(cacheKey, ratelimit);
  return ratelimit;
}

export async function isRateLimited(key: string, limit: number, windowMs: number): Promise<boolean> {
  const ratelimit = getUpstashRatelimit(limit, windowMs);

  if (!ratelimit) {
    return isMemoryRateLimited(key, limit, windowMs);
  }

  try {
    const result = await ratelimit.limit(key);
    if (result.pending) {
      void result.pending.catch(() => undefined);
    }
    return !result.success;
  } catch (error) {
    markDistributedRateLimitFailure(error);
    return isMemoryRateLimited(key, limit, windowMs);
  }
}

export function getRateLimitKey(request: Request, prefix: string): string {
  // x-real-ip: Vercel이 신뢰할 수 있는 실제 클라이언트 IP (스푸핑 방지)
  // x-forwarded-for: 프록시 체인의 첫 번째 IP (스푸핑 가능성 있음)
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return `${prefix}:${ip}`;
}
