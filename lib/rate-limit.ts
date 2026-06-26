/**
 * Lightweight in-memory fixed-window rate limiter for API routes (SR-002).
 *
 * Baseline defense-in-depth only: the bucket map is per-process, so on
 * serverless/multi-instance hosting it does NOT share state across instances.
 * For production, back this with a shared store (Upstash Ratelimit) or a WAF.
 */

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  retryAfter: number; // seconds
}

/** Returns { ok:false } when the caller exceeds `limit` requests per `windowMs`. */
export function rateLimit(
  req: Request,
  key: string,
  limit: number,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const id = `${key}:${clientIp(req)}`;
  const b = buckets.get(id);

  if (!b || now >= b.reset) {
    buckets.set(id, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}
