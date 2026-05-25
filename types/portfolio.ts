import type { Language } from "@/types/language";
import type { CollageLayout } from "@/lib/stills/collage-layout";

/** DB row — video_categories */
export interface VideoCategory {
  id: string;
  title_en: string;
  title_he: string;
  slug: string;
  sort_order: number;
  initial_visible_count: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

/** UI-friendly category for grids */
export interface PortfolioVideoCategory {
  id: string;
  slug: string;
  label: { en: string; he: string };
  initialVisibleCount: number;
}

/** DB row — video_works */
export interface VideoWork {
  id: string;
  category_id: string | null;
  title_en: string;
  title_he: string;
  youtube_url: string;
  youtube_id: string | null;
  thumbnail_url: string | null;
  custom_cover_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

/** UI-friendly video work card */
export interface PortfolioVideoWork {
  id: string;
  categorySlug: string;
  title: { en: string; he: string };
  youtubeUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  customCoverUrl?: string;
  thumbnailLabel: string;
  sortOrder: number;
}

/** DB row — still_images */
export interface StillImage {
  id: string;
  image_url: string;
  storage_path: string | null;
  alt_en: string | null;
  alt_he: string | null;
  width: number | null;
  height: number | null;
  aspect_ratio: number | null;
  sort_order: number;
  is_published: boolean;
  show_in_hero?: boolean;
  collage_layout?: CollageLayout | null;
  created_at?: string;
  updated_at?: string;
}

export function localizedTitle(
  row: { title_en: string; title_he: string },
  language: Language,
): string {
  return language === "he" ? row.title_he : row.title_en;
}

export function localizedAlt(
  row: { alt_en: string | null; alt_he: string | null },
  language: Language,
): string {
  const en = row.alt_en ?? "";
  const he = row.alt_he ?? "";
  return language === "he" ? he || en : en || he;
}
