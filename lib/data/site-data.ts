import {
  getLegacyVideoCategories,
  getPublishedStillImages,
  getPublishedVideoWorkItems,
} from "@/lib/api/portfolio";
import { getPublishedServiceItems } from "@/lib/api/services";
import type { StillWorkItem, ServiceItem, VideoWorkItem } from "@/types/works";
import type { VideoCategoryId } from "@/types/works";

export interface SitePortfolioData {
  categories: { id: VideoCategoryId; label: { en: string; he: string } }[];
  videoWorks: VideoWorkItem[];
  stills: StillWorkItem[];
  services: ServiceItem[];
}

/** Server-only bundle for homepage sections */
export async function loadSitePortfolioData(): Promise<SitePortfolioData> {
  const [categories, videoWorks, stills, services] = await Promise.all([
    getLegacyVideoCategories(),
    getPublishedVideoWorkItems(),
    getPublishedStillImages(),
    getPublishedServiceItems(),
  ]);

  return { categories, videoWorks, stills, services };
}
