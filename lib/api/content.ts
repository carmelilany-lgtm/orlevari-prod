import { unstable_cache } from "next/cache";
import { SITE_CACHE_TAGS, SITE_DATA_REVALIDATE_SECONDS } from "@/lib/cache/site-tags";
import { toCachedMediaUrl } from "@/lib/images/public-media-url";
import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { SiteContentItem, SiteContentKey } from "@/types/content";
import type { Language } from "@/types/language";

const SITE_CONTENT_PUBLIC_SELECT = "id, key, value_en, value_he";

const IMAGE_CONTENT_KEYS = new Set([
  "about_image_url",
  "about_extended_image_url",
]);

function rewritePublicContentUrls(rows: SiteContentItem[]): SiteContentItem[] {
  return rows.map((row) => {
    if (!IMAGE_CONTENT_KEYS.has(row.key)) return row;
    return {
      ...row,
      value_en: row.value_en ? toCachedMediaUrl(row.value_en) : row.value_en,
      value_he: row.value_he ? toCachedMediaUrl(row.value_he) : row.value_he,
    };
  });
}

const loadSiteContent = unstable_cache(
  async (): Promise<SiteContentItem[]> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("site_content")
      .select(SITE_CONTENT_PUBLIC_SELECT)
      .order("key", { ascending: true });

    if (error) {
      console.error("[lev-ari] site_content:", error.message);
      return [];
    }

    return rewritePublicContentUrls((data ?? []) as SiteContentItem[]);
  },
  ["site-content"],
  { revalidate: SITE_DATA_REVALIDATE_SECONDS, tags: [SITE_CACHE_TAGS.publicData] },
);

export async function getSiteContent(): Promise<SiteContentItem[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getSiteContent");
    return [];
  }

  return loadSiteContent();
}

export async function getSiteContentMap(): Promise<
  Record<string, SiteContentItem>
> {
  const rows = await getSiteContent();
  return Object.fromEntries(rows.map((row) => [row.key, row]));
}

export async function getContentValue(
  key: SiteContentKey | string,
  language: Language,
): Promise<string | null> {
  const map = await getSiteContentMap();
  const row = map[key];
  if (!row) return null;
  const value = language === "he" ? row.value_he : row.value_en;
  return value ?? row.value_en ?? row.value_he ?? null;
}
