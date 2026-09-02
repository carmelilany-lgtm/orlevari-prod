function originFromEnv(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  try {
    const withProtocol = raw.includes("://") ? raw.trim() : `https://${raw.trim()}`;
    return new URL(withProtocol).origin;
  } catch {
    return undefined;
  }
}

/**
 * Production site origin. Prefers NEXT_PUBLIC_SITE_URL, then Vercel's
 * production host so Open Graph / WhatsApp previews still get absolute URLs.
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

/** Absolute URL for a public path (e.g. `/privacy-policy`). */
export function absolutePublicUrl(path: string): string | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
