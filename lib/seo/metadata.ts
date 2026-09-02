import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/api/content";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import {
  DEFAULT_SEO_DESCRIPTION_EN,
  DEFAULT_SEO_DESCRIPTION_HE,
  DEFAULT_SEO_TITLE_EN,
  DEFAULT_SEO_TITLE_HE,
  resolveSeoDescription,
  resolveSeoTitle,
} from "@/lib/seo/document-title";
import { absolutePublicUrl, getMetadataBase } from "@/lib/seo/site-url";

const DEFAULT_TITLE = `${DEFAULT_SEO_TITLE_EN} | ${DEFAULT_SEO_TITLE_HE}`;
const DEFAULT_DESCRIPTION = `${DEFAULT_SEO_DESCRIPTION_EN} ${DEFAULT_SEO_DESCRIPTION_HE}`;

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };

type PublicPageMetaInput = {
  title: string;
  description: string;
  path: string;
};

/** Shared Open Graph, Twitter, and canonical for public static pages */
export function buildPublicPageMetadata({
  title,
  description,
  path,
}: PublicPageMetaInput): Metadata {
  const metadataBase = getMetadataBase();
  const canonical = absolutePublicUrl(path);

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Lev Ari Productions",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Homepage metadata for the request locale, with CMS overrides */
export async function buildHomeMetadata(): Promise<Metadata> {
  const [cmsMap, locale] = await Promise.all([
    getSiteContentMap(),
    getRequestLocale(),
  ]);
  const metadataBase = getMetadataBase();

  const title = resolveSeoTitle(cmsMap, locale);
  const description = resolveSeoDescription(cmsMap, locale);
  const siteName = locale === "he" ? "לב ארי הפקות" : "Lev Ari Productions";

  const canonical = absolutePublicUrl("/");

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    ...(metadataBase ? { metadataBase } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      locale: locale === "he" ? "he_IL" : "en_US",
      alternateLocale: [locale === "he" ? "en_US" : "he_IL"],
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
