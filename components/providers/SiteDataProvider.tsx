"use client";

import type { SitePortfolioData } from "@/lib/data/site-data";
import {
  MOCK_LEGACY_CATEGORIES,
  MOCK_SERVICES,
  MOCK_STILLS,
  toVideoWorkItems,
  MOCK_PORTFOLIO_VIDEO_WORKS,
} from "@/data/mock";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const defaultData: SitePortfolioData = {
  categories: MOCK_LEGACY_CATEGORIES,
  videoWorks: toVideoWorkItems(MOCK_PORTFOLIO_VIDEO_WORKS),
  stills: MOCK_STILLS,
  services: MOCK_SERVICES.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
  })),
};

const SiteDataContext = createContext<SitePortfolioData>(defaultData);

export function SiteDataProvider({
  children,
  data,
}: {
  children: ReactNode;
  data?: SitePortfolioData;
}) {
  return (
    <SiteDataContext.Provider value={data ?? defaultData}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData(): SitePortfolioData {
  return useContext(SiteDataContext);
}
