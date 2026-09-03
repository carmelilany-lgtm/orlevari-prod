import { unstable_cache } from "next/cache";
import {
  MOCK_PORTFOLIO_CATEGORIES,
  MOCK_PORTFOLIO_VIDEO_WORKS,
  MOCK_STILLS,
} from "@/data/mock";
import { SITE_CACHE_TAGS, SITE_DATA_REVALIDATE_SECONDS } from "@/lib/cache/site-tags";
import { warnSupabaseMissing, isSupabaseConfigured } from "@/lib/supabase/env";
import {
  toLegacyVideoCategory,
  toPortfolioCategory,
  toPortfolioVideoWork,
  toStillWorkItem,
  toVideoWorkItem,
} from "@/lib/supabase/mappers";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  PortfolioVideoCategory,
  PortfolioVideoWork,
  StillImage,
  VideoCategory,
  VideoWork,
} from "@/types/portfolio";
import type { SiteVideoCategory } from "@/lib/data/site-data";
import type { StillWorkItem, VideoWorkItem } from "@/types/works";

const VIDEO_CATEGORY_PUBLIC_SELECT =
  "id, slug, title_en, title_he, initial_visible_count, sort_order";
const VIDEO_WORK_PUBLIC_SELECT =
  "id, category_id, title_en, title_he, youtube_url, youtube_id, thumbnail_url, custom_cover_url, sort_order";
const STILL_PUBLIC_SELECT =
  "id, image_url, alt_en, alt_he, width, height, aspect_ratio, sort_order, is_published, show_in_hero, exclude_from_hero, collage_layout";

const loadPublishedVideoCategories = unstable_cache(
  async (): Promise<PortfolioVideoCategory[]> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      console.error("[lev-ari] getPublishedVideoCategories: no Supabase client");
      return [];
    }

    const { data, error } = await supabase
      .from("video_categories")
      .select(VIDEO_CATEGORY_PUBLIC_SELECT)
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
  },
  ["published-video-categories"],
  { revalidate: SITE_DATA_REVALIDATE_SECONDS, tags: [SITE_CACHE_TAGS.publicData] },
);

const loadPublishedVideoWorks = unstable_cache(
  async (): Promise<PortfolioVideoWork[]> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      console.error("[lev-ari] getPublishedVideoWorks: no Supabase client");
      return [];
    }

    const [categories, worksResult] = await Promise.all([
      loadPublishedVideoCategories(),
      supabase
        .from("video_works")
        .select(VIDEO_WORK_PUBLIC_SELECT)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

    const slugByCategoryId = new Map(categories.map((c) => [c.id, c.slug]));

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
  },
  ["published-video-works"],
  { revalidate: SITE_DATA_REVALIDATE_SECONDS, tags: [SITE_CACHE_TAGS.publicData] },
);

const loadPublishedStillImages = unstable_cache(
  async (): Promise<StillWorkItem[]> => {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      console.error("[lev-ari] getPublishedStillImages: no Supabase client");
      return [];
    }

    const { data, error } = await supabase
      .from("still_images")
      .select(STILL_PUBLIC_SELECT)
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
  },
  ["published-still-images"],
  { revalidate: SITE_DATA_REVALIDATE_SECONDS, tags: [SITE_CACHE_TAGS.publicData] },
);

export async function getPublishedVideoCategories(): Promise<
  PortfolioVideoCategory[]
> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedVideoCategories");
    return MOCK_PORTFOLIO_CATEGORIES;
  }

  return loadPublishedVideoCategories();
}

export async function getPublishedVideoWorks(): Promise<PortfolioVideoWork[]> {
  if (!isSupabaseConfigured()) {
    warnSupabaseMissing("getPublishedVideoWorks");
    return MOCK_PORTFOLIO_VIDEO_WORKS;
  }

  return loadPublishedVideoWorks();
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

  return loadPublishedStillImages();
}

/** Categories for public Works grid (slug id + per-category initial visible count) */
export async function getLegacyVideoCategories(): Promise<SiteVideoCategory[]> {
  const categories = await getPublishedVideoCategories();
  return categories.map(toLegacyVideoCategory);
}
