import { resolveCmsText } from "@/lib/i18n/cms";
import {
  getAccessibilityStatementContent,
  getPrivacyPolicyContent,
} from "@/lib/i18n/legal-content";
import { translations } from "@/lib/i18n/translations";
import type { SiteContentMap } from "@/types/content";
import type { Locale } from "@/types/i18n";

export const DEFAULT_SEO_TITLE_EN = "Lev Ari Productions | Cinematic Video";
export const DEFAULT_SEO_TITLE_HE = "לב ארי הפקות | הפקות וידאו קולנועיות";

export const DEFAULT_SEO_DESCRIPTION_EN =
  "Cinematic video production for businesses, events & artists.";
export const DEFAULT_SEO_DESCRIPTION_HE =
  "הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.";

export function resolveSeoTitle(
  cmsMap: SiteContentMap | undefined,
  locale: Locale,
): string {
  if (locale === "he") {
    return resolveCmsText(
      cmsMap,
      "seo_title_he",
      "he",
      DEFAULT_SEO_TITLE_HE,
    );
  }
  return resolveCmsText(
    cmsMap,
    "seo_title_en",
    "en",
    DEFAULT_SEO_TITLE_EN,
  );
}

export function resolveSeoDescription(
  cmsMap: SiteContentMap | undefined,
  locale: Locale,
): string {
  if (locale === "he") {
    return resolveCmsText(
      cmsMap,
      "seo_description_he",
      "he",
      DEFAULT_SEO_DESCRIPTION_HE,
    );
  }
  return resolveCmsText(
    cmsMap,
    "seo_description_en",
    "en",
    DEFAULT_SEO_DESCRIPTION_EN,
  );
}

/** Tab title for the current public path and UI language. */
export function documentTitleForPath(
  pathname: string,
  locale: Locale,
  cmsMap?: SiteContentMap,
): string {
  const brand = translations[locale].brand;
  if (pathname.includes("privacy-policy")) {
    return `${getPrivacyPolicyContent(locale).title} | ${brand}`;
  }
  if (pathname.includes("accessibility-statement")) {
    return `${getAccessibilityStatementContent(locale).title} | ${brand}`;
  }
  return resolveSeoTitle(cmsMap, locale);
}
