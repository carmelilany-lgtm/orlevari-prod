import type { SiteContentItem, SiteContentMap } from "@/types/content";
import type { SiteContentKey } from "@/types/content";
import type { Locale } from "@/types/i18n";

function pickCmsValue(
  row: SiteContentItem | undefined,
  locale: Locale,
): string | null {
  if (!row) return null;
  const primary = locale === "he" ? row.value_he : row.value_en;
  const secondary = locale === "he" ? row.value_en : row.value_he;
  const value = primary?.trim() || secondary?.trim();
  return value || null;
}

/** CMS value only — null when missing or whitespace-only */
export function getCmsRawValue(
  map: SiteContentMap | undefined,
  key: SiteContentKey,
  locale: Locale,
): string | null {
  return pickCmsValue(map?.[key], locale);
}

/** Resolve CMS text with fallback when empty or missing */
export function resolveCmsText(
  map: SiteContentMap | undefined,
  key: SiteContentKey,
  locale: Locale,
  fallback: string,
): string {
  return getCmsRawValue(map, key, locale) ?? fallback;
}
