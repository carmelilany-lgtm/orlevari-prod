/** Production site URL from NEXT_PUBLIC_SITE_URL (no trailing slash). */
export function getSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    return undefined;
  }
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
