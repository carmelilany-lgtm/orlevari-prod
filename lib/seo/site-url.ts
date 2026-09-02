import { headers } from "next/headers";

function isLocalHostname(hostname: string): boolean {
  const host = hostname.replace(/:\d+$/, "").toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "[::1]" ||
    host === "::1"
  );
}

function originFromEnv(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const withProtocol = raw.includes("://")
      ? raw.trim()
      : `https://${raw.trim()}`;
    const url = new URL(withProtocol);
    if (isLocalHostname(url.hostname)) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

/**
 * Public site origin for canonical + Open Graph.
 * Ignores localhost so WhatsApp never receives `http://localhost:3000/og-image.png`.
 */
export function getSiteUrl(): string | undefined {
  return (
    originFromEnv(process.env.NEXT_PUBLIC_SITE_URL) ||
    originFromEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  );
}

export function getMetadataBase(): URL | undefined {
  const site = getSiteUrl();
  if (!site) return undefined;
  return new URL(site);
}

/**
 * Origin for OG tags. Uses env first, then the request Host so crawlers
 * (WhatsApp) never get a localhost image URL.
 */
export async function resolvePublicOrigin(): Promise<string | undefined> {
  const configured = getSiteUrl();
  if (configured) return configured;

  try {
    const h = await headers();
    const hostHeader = h.get("x-forwarded-host") ?? h.get("host");
    const host = hostHeader?.split(",")[0]?.trim();
    if (!host || isLocalHostname(host)) return undefined;
    const proto = (h.get("x-forwarded-proto") || "https")
      .split(",")[0]
      ?.trim();
    return `${proto || "https"}://${host}`;
  } catch {
    return undefined;
  }
}

/** Absolute URL for a public path (e.g. `/privacy-policy`). */
export function absolutePublicUrl(path: string): string | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
