import type {
  PortfolioVideoCategory,
  PortfolioVideoWork,
  StillImage,
  VideoCategory,
  VideoWork,
} from "@/types/portfolio";
import type { Service, ServiceDisplay } from "@/types/services";
import {
  parseYoutubeId,
  resolveVideoYoutubeId,
} from "@/lib/youtube/client";
import { parseCollageLayout } from "@/lib/stills/collage-layout";
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
): {
  id: VideoCategoryId;
  label: { en: string; he: string };
  initialVisibleCount: number;
} {
  return {
    id: row.slug as VideoCategoryId,
    label: row.label,
    initialVisibleCount: row.initialVisibleCount,
  };
}

export function toPortfolioVideoWork(
  row: VideoWork,
  categorySlug: string,
): PortfolioVideoWork {
  const youtubeId =
    row.youtube_id?.trim() ||
    parseYoutubeId(row.youtube_url) ||
    undefined;

  return {
    id: row.id,
    categorySlug,
    title: { en: row.title_en, he: row.title_he },
    youtubeUrl: row.youtube_url,
    youtubeId,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    customCoverUrl: row.custom_cover_url ?? undefined,
    thumbnailLabel: row.title_en,
    sortOrder: row.sort_order,
  };
}

export function toVideoWorkItem(work: PortfolioVideoWork): VideoWorkItem {
  const youtubeId =
    resolveVideoYoutubeId({
      youtubeId: work.youtubeId,
      youtubeUrl: work.youtubeUrl,
    }) ?? undefined;

  return {
    id: work.id,
    categoryId: work.categorySlug as VideoCategoryId,
    title: work.title,
    youtubeUrl: work.youtubeUrl,
    youtubeId,
    thumbnailUrl: work.thumbnailUrl,
    customCoverUrl: work.customCoverUrl,
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
    collage_layout: parseCollageLayout(row.collage_layout),
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
