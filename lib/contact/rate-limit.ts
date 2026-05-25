/**
 * Best-effort in-memory rate limit for contact submissions.
 * On serverless, limits apply per warm instance — still reduces burst spam.
 * For stronger protection, add Cloudflare Turnstile (see docs/launch-checklist.md).
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

type WindowEntry = { count: number; windowStart: number };

const windows = new Map<string, WindowEntry>();

function pruneStale(now: number): void {
  if (windows.size < 500) return;
  for (const [ip, entry] of windows) {
    if (now - entry.windowStart > WINDOW_MS) windows.delete(ip);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** Returns true when the client should be blocked for this window. */
export function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneStale(now);

  const entry = windows.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    windows.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  entry.count += 1;
  return false;
}
