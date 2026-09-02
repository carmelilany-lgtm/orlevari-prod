"use client";

import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { ConsentedAnalytics } from "@/components/privacy/ConsentedAnalytics";
import { PrivacyConsentBanner } from "@/components/privacy/PrivacyConsentBanner";
import { VisualEditorShell } from "@/components/visual-editor/VisualEditorShell";
import { LanguageProvider } from "@/lib/i18n/context";
import type { SitePortfolioData } from "@/lib/data/site-data";
import type { SiteContentMap } from "@/types/content";
import type { Locale } from "@/types/i18n";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  siteData,
  cmsMap,
  whatsappEnvFallback,
  initialLocale,
}: {
  children: ReactNode;
  siteData?: SitePortfolioData;
  cmsMap?: SiteContentMap;
  /** Server-only WHATSAPP_PHONE passed for client floating button / contact */
  whatsappEnvFallback?: string;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider
      cmsMap={cmsMap}
      isLiveData={siteData?.isLiveData ?? false}
      whatsappEnvFallback={whatsappEnvFallback}
      initialLocale={initialLocale}
    >
      <VisualEditorShell>
        <SiteDataProvider data={siteData}>{children}</SiteDataProvider>
        <PrivacyConsentBanner />
        <ConsentedAnalytics />
      </VisualEditorShell>
    </LanguageProvider>
  );
}
