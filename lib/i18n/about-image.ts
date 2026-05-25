import type { SiteContentMap } from "@/types/content";

/** CMS about section image URL (locale-agnostic; prefers value_en). */
export function getAboutImageUrl(map: SiteContentMap | undefined): string | null {
  const row = map?.about_image_url;
  if (!row) return null;
  const url = row.value_en?.trim() || row.value_he?.trim();
  return url || null;
}
