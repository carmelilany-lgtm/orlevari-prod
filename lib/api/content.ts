import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SiteContentItem, SiteContentKey } from "@/types/content";
import type { Language } from "@/types/language";

export async function getSiteContent(): Promise<SiteContentItem[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getSiteContent");
    return [];
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });

  if (error) {
    console.error("[lev-ari] site_content:", error.message);
    return [];
  }

  return (data ?? []) as SiteContentItem[];
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
