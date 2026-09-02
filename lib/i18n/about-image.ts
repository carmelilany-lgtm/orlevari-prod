import type { SiteContentMap } from "@/types/content";

function pickImageUrl(
  row: SiteContentMap[keyof SiteContentMap] | undefined,
): string | null {
  if (!row) return null;
  const url = row.value_en?.trim() || row.value_he?.trim();
  return url || null;
}

/** CMS about section image URL (locale-agnostic; prefers value_en). */
export function getAboutImageUrl(map: SiteContentMap | undefined): string | null {
  return pickImageUrl(map?.about_image_url);
}

/** CMS extended about image URL - falls back handled in About section. */
export function getAboutExtendedImageUrl(
  map: SiteContentMap | undefined,
): string | null {
  return pickImageUrl(map?.about_extended_image_url);
}
