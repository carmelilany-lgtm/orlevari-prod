import type {
  PortfolioVideoCategory,
  PortfolioVideoWork,
  StillImage,
  VideoCategory,
  VideoWork,
} from "@/types/portfolio";
import type { Service, ServiceDisplay } from "@/types/services";
import type { StillWorkItem, VideoWorkItem } from "@/types/works";
import type { VideoCategoryId } from "@/types/works";

export function toPortfolioCategory(row: VideoCategory): PortfolioVideoCategory {
  return {
    id: row.id,
    slug: row.slug,
    label: { en: row.title_en, he: row.title_he },
    initialVisibleCount: row.initial_visible_count,
  };
}

export function toLegacyVideoCategory(
  row: PortfolioVideoCategory,
): { id: VideoCategoryId; label: { en: string; he: string } } {
  return {
    id: row.slug as VideoCategoryId,
    label: row.label,
  };
}

export function toPortfolioVideoWork(
  row: VideoWork,
  categorySlug: string,
): PortfolioVideoWork {
  return {
    id: row.id,
    categorySlug,
    title: { en: row.title_en, he: row.title_he },
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    customCoverUrl: row.custom_cover_url ?? undefined,
    thumbnailLabel: row.title_en,
    sortOrder: row.sort_order,
  };
}

export function toVideoWorkItem(work: PortfolioVideoWork): VideoWorkItem {
  return {
    id: work.id,
    categoryId: work.categorySlug as VideoCategoryId,
    title: work.title,
    youtubeId: work.youtubeId,
    thumbnailLabel: work.thumbnailLabel,
  };
}

export function toStillWorkItem(row: StillImage): StillWorkItem {
  return {
    id: row.id,
    image_url: row.image_url,
    alt_en: row.alt_en ?? "",
    alt_he: row.alt_he ?? "",
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    aspect_ratio: row.aspect_ratio != null ? Number(row.aspect_ratio) : undefined,
    sort_order: row.sort_order,
    published: row.is_published,
  };
}

export function toServiceDisplay(row: Service): ServiceDisplay {
  return {
    id: row.id,
    title: { en: row.title_en, he: row.title_he },
    description: {
      en: row.description_en ?? "",
      he: row.description_he ?? "",
    },
    iconKey: row.icon_key ?? undefined,
  };
}

export { parseYoutubeId } from "@/lib/youtube/client";
