type EnvShape = Record<string, string | undefined>;

export const RATE_LIMIT_PREFIX = "internet-dinor:ratelimit";
export const RATE_LIMIT_RETRY_COOLDOWN_MS = 60_000;

export const UPSTASH_RATE_LIMIT_ENV_PAIRS = [
  {
    urlKey: "UPSTASH_REDIS_REST_URL",
    tokenKey: "UPSTASH_REDIS_REST_TOKEN"
  },
  {
    urlKey: "KV_REST_API_URL",
    tokenKey: "KV_REST_API_TOKEN"
  }
] as const;

export interface ResolvedUpstashRateLimitEnv {
  url: string;
  token: string;
}

export function resolveUpstashRateLimitEnv(env: EnvShape = process.env): ResolvedUpstashRateLimitEnv | null {
  for (const { urlKey, tokenKey } of UPSTASH_RATE_LIMIT_ENV_PAIRS) {
    const url = env[urlKey];
    const token = env[tokenKey];

    if (url && token) {
      return { url, token };
    }
  }

  return null;
}

export function hasUpstashRateLimitEnv(env: EnvShape = process.env): boolean {
  return resolveUpstashRateLimitEnv(env) !== null;
}

export function getUpstashRateLimitEnvIssues(env: EnvShape = process.env) {
  const issues: Array<{ key: string; message: string }> = [];

  for (const { urlKey, tokenKey } of UPSTASH_RATE_LIMIT_ENV_PAIRS) {
    const hasUrl = Boolean(env[urlKey]);
    const hasToken = Boolean(env[tokenKey]);

    if (hasUrl && !hasToken) {
      issues.push({
        key: tokenKey,
        message: `${urlKey}가 설정되어 있으면 ${tokenKey}도 함께 필요합니다.`
      });
    }

    if (!hasUrl && hasToken) {
      issues.push({
        key: urlKey,
        message: `${tokenKey}가 설정되어 있으면 ${urlKey}도 함께 필요합니다.`
      });
    }
  }

  return issues;
}
