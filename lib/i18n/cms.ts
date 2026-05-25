import type { SiteContentMap } from "@/types/content";
import type { SiteContentKey } from "@/types/content";
import type { Locale } from "@/types/i18n";

/** Resolve CMS text with fallback when empty or missing */
export function resolveCmsText(
  map: SiteContentMap | undefined,
  key: SiteContentKey,
  locale: Locale,
  fallback: string,
): string {
  const row = map?.[key];
  if (!row) return fallback;
  const primary = locale === "he" ? row.value_he : row.value_en;
  const secondary = locale === "he" ? row.value_en : row.value_he;
  const value = primary?.trim() || secondary?.trim();
  return value || fallback;
}
