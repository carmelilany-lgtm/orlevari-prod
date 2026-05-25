import {
  getLegacyVideoCategories,
  getPublishedStillImages,
  getPublishedVideoWorkItems,
} from "@/lib/api/portfolio";
import { getPublishedServiceItems } from "@/lib/api/services";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { StillWorkItem, ServiceItem, VideoWorkItem } from "@/types/works";
import type { VideoCategoryId } from "@/types/works";

export interface SiteVideoCategory {
  id: VideoCategoryId;
  label: { en: string; he: string };
  initialVisibleCount: number;
}

export interface SitePortfolioData {
  categories: SiteVideoCategory[];
  videoWorks: VideoWorkItem[];
  stills: StillWorkItem[];
  services: ServiceItem[];
  /** True when Supabase env is configured (live data path, not mock) */
  isLiveData: boolean;
}

/** Server-only bundle for homepage sections */
export async function loadSitePortfolioData(): Promise<SitePortfolioData> {
  const isLiveData = isSupabaseConfigured();
  const [categories, videoWorks, stills, services] = await Promise.all([
    getLegacyVideoCategories(),
    getPublishedVideoWorkItems(),
    getPublishedStillImages(),
    getPublishedServiceItems(),
  ]);

  return { categories, videoWorks, stills, services, isLiveData };
}
