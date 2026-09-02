import type { CollageLayout } from "@/lib/stills/collage-layout";

export type WorkFilter = "all" | "video" | "stills";

export type VideoCategoryId =
  | "corporate"
  | "events"
  | "family"
  | "music-shows"
  | "documentary"
  | "short-films"
  | "news"
  | "haam-im-hagolan"
  | "cooking";

export interface VideoWorkItem {
  id: string;
  categoryId: VideoCategoryId;
  title: { en: string; he: string };
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  customCoverUrl?: string;
  thumbnailLabel: string;
}

/** Supabase `still_works` row shape — snake_case matches DB columns */
export interface StillWorkItem {
  id: string;
  /** Public URL from Supabase Storage */
  image_url?: string;
  alt_en: string;
  alt_he: string;
  width?: number;
  height?: number;
  /** width / height — stored on upload or derived from dimensions */
  aspect_ratio?: number;
  sort_order?: number;
  published?: boolean;
  show_in_hero?: boolean;
  /** When true, excluded from random public hero pool */
  exclude_from_hero?: boolean;
  collage_layout?: CollageLayout | null;
  /** Mock-only: gradient variant for placeholders without image_url */
  variant?: number;
}

export function stillAlt(item: StillWorkItem, locale: "en" | "he"): string {
  return locale === "he" ? item.alt_he : item.alt_en;
}

export function stillAspectRatio(item: StillWorkItem): number | undefined {
  if (item.aspect_ratio != null && item.aspect_ratio > 0) {
    return item.aspect_ratio;
  }
  if (item.width && item.height) {
    return item.width / item.height;
  }
  return undefined;
}

export interface ServiceItem {
  id: string;
  title: { en: string; he: string };
  description: { en: string; he: string };
  iconKey?: string;
}
