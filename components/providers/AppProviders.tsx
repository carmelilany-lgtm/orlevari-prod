"use client";

import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { LanguageProvider } from "@/lib/i18n/context";
import type { SitePortfolioData } from "@/lib/data/site-data";
import type { SiteContentMap } from "@/types/content";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  siteData,
  cmsMap,
  whatsappEnvFallback,
}: {
  children: ReactNode;
  siteData?: SitePortfolioData;
  cmsMap?: SiteContentMap;
  /** Server-only WHATSAPP_PHONE passed for client floating button / contact */
  whatsappEnvFallback?: string;
}) {
  return (
    <LanguageProvider
      cmsMap={cmsMap}
      isLiveData={siteData?.isLiveData ?? false}
      whatsappEnvFallback={whatsappEnvFallback}
    >
      <SiteDataProvider data={siteData}>{children}</SiteDataProvider>
    </LanguageProvider>
  );
}
