/**
 * Central typed mock data — used when Supabase env vars are not configured.
 * Replace consumption with lib/api/* on the server when loading live data.
 */
import { MOCK_STILLS, MOCK_VIDEO_WORKS } from "@/data/mock-works";
import { SERVICES } from "@/data/services";
import { VIDEO_CATEGORIES } from "@/data/video-categories";
import { toVideoWorkItem } from "@/lib/supabase/mappers";
import type { PortfolioVideoCategory, PortfolioVideoWork } from "@/types/portfolio";
import type { ServiceDisplay } from "@/types/services";
import type { VideoWorkItem } from "@/types/works";

export { MOCK_STILLS, MOCK_VIDEO_WORKS };

export const MOCK_PORTFOLIO_CATEGORIES: PortfolioVideoCategory[] =
  VIDEO_CATEGORIES.map((c) => ({
    id: c.id,
    slug: c.id,
    label: c.label,
    initialVisibleCount: 3,
  }));

export const MOCK_PORTFOLIO_VIDEO_WORKS: PortfolioVideoWork[] =
  MOCK_VIDEO_WORKS.map((item, index) => ({
    id: item.id,
    categorySlug: item.categoryId,
    title: item.title,
    youtubeUrl: item.youtubeId
      ? `https://www.youtube.com/watch?v=${item.youtubeId}`
      : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: item.youtubeId,
    thumbnailLabel: item.thumbnailLabel,
    sortOrder: index,
  }));

export const MOCK_SERVICES: ServiceDisplay[] = SERVICES.map((s) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  iconKey: s.id,
}));

/** @deprecated Use MOCK_PORTFOLIO_VIDEO_WORKS — kept for lib/api fallback name */
export const MOCK_VIDEO_WORKS_PORTFOLIO = MOCK_PORTFOLIO_VIDEO_WORKS;

export function toVideoWorkItems(works: PortfolioVideoWork[]): VideoWorkItem[] {
  return works.map(toVideoWorkItem);
}

export const MOCK_LEGACY_CATEGORIES = VIDEO_CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  initialVisibleCount: 3,
}));
