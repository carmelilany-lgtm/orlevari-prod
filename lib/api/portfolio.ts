import {
  MOCK_PORTFOLIO_CATEGORIES,
  MOCK_PORTFOLIO_VIDEO_WORKS,
  MOCK_STILLS,
} from "@/data/mock";
import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import {
  toLegacyVideoCategory,
  toPortfolioCategory,
  toPortfolioVideoWork,
  toStillWorkItem,
  toVideoWorkItem,
} from "@/lib/supabase/mappers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  PortfolioVideoCategory,
  PortfolioVideoWork,
  StillImage,
  VideoCategory,
  VideoWork,
} from "@/types/portfolio";
import type { SiteVideoCategory } from "@/lib/data/site-data";
import type { StillWorkItem, VideoWorkItem } from "@/types/works";

export async function getPublishedVideoCategories(): Promise<
  PortfolioVideoCategory[]
> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedVideoCategories");
    return MOCK_PORTFOLIO_CATEGORIES;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[lev-ari] getPublishedVideoCategories: no Supabase client");
    return [];
  }

  const { data, error } = await supabase
    .from("video_categories")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[lev-ari] video_categories:", error.message);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  return (data as VideoCategory[]).map(toPortfolioCategory);
}

export async function getPublishedVideoWorks(): Promise<PortfolioVideoWork[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedVideoWorks");
    return MOCK_PORTFOLIO_VIDEO_WORKS;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[lev-ari] getPublishedVideoWorks: no Supabase client");
    return [];
  }

  const [categories, worksResult] = await Promise.all([
    getPublishedVideoCategories(),
    supabase
      .from("video_works")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const slugByCategoryId = new Map(
    categories.map((c) => [c.id, c.slug]),
  );

  if (worksResult.error) {
    console.error("[lev-ari] video_works:", worksResult.error.message);
    return [];
  }

  if (!worksResult.data?.length) {
    return [];
  }

  return (worksResult.data as VideoWork[])
    .map((row) => {
      const slug =
        (row.category_id && slugByCategoryId.get(row.category_id)) ?? "corporate";
      return toPortfolioVideoWork(row, slug);
    })
    .filter((w) => w.categorySlug);
}

/** Legacy UI shape grouped by slug */
export async function getPublishedVideoWorkItems(): Promise<VideoWorkItem[]> {
  const works = await getPublishedVideoWorks();
  return works.map(toVideoWorkItem);
}

export async function getPublishedStillImages(): Promise<StillWorkItem[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedStillImages");
    return MOCK_STILLS;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    console.error("[lev-ari] getPublishedStillImages: no Supabase client");
    return [];
  }

  const { data, error } = await supabase
    .from("still_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[lev-ari] still_images:", error.message);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  return (data as StillImage[]).map(toStillWorkItem);
}

/** Categories for public Works grid (slug id + per-category initial visible count) */
export async function getLegacyVideoCategories(): Promise<SiteVideoCategory[]> {
  const categories = await getPublishedVideoCategories();
  return categories.map(toLegacyVideoCategory);
}
