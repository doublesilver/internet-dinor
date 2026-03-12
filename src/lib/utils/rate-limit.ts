// 주의: 인메모리 Map은 단일 서버리스 인스턴스 내에서만 동작합니다.
// Vercel 등 서버리스 환경에서는 인스턴스별로 독립된 메모리를 가지므로
// 정확한 글로벌 rate limit이 필요하다면 Redis(Upstash 등) 사용을 권장합니다.
const store = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
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

export function getRateLimitKey(request: Request, prefix: string): string {
  // x-real-ip: Vercel이 신뢰할 수 있는 실제 클라이언트 IP (스푸핑 방지)
  // x-forwarded-for: 프록시 체인의 첫 번째 IP (스푸핑 가능성 있음)
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return `${prefix}:${ip}`;
}
