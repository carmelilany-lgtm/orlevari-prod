import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/api/content";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import {
  DEFAULT_SEO_DESCRIPTION_EN,
  DEFAULT_SEO_DESCRIPTION_HE,
  DEFAULT_SEO_TITLE_EN,
  DEFAULT_SEO_TITLE_HE,
  resolveSeoDescription,
  resolveSeoTitle,
} from "@/lib/seo/document-title";
import { absolutePublicUrl, resolveCrawlerOrigin, resolvePublicOrigin } from "@/lib/seo/site-url";
import type { Locale } from "@/types/i18n";

const DEFAULT_TITLE = `${DEFAULT_SEO_TITLE_HE} | ${DEFAULT_SEO_TITLE_EN}`;
const DEFAULT_DESCRIPTION = `${DEFAULT_SEO_DESCRIPTION_HE} ${DEFAULT_SEO_DESCRIPTION_EN}`;

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION };

/** Stable public paths (no Next.js content hashes) for WhatsApp and iOS. */
export const SITE_ICONS = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: [
    {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
} as const satisfies Metadata["icons"];

export const SITE_SHARE_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Lev Ari Productions | לב ארי הפקות",
} as const;

export function googleVerificationMetadata(): Pick<Metadata, "verification"> {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!google) return {};
  return { verification: { google } };
}

export function localeOpenGraph(locale: Locale) {
  return {
    locale: locale === "he" ? "he_IL" : "en_US",
    alternateLocale: [locale === "he" ? "en_US" : "he_IL"] as string[],
  };
}

function localizedAbsoluteUrl(
  origin: string | undefined,
  locale: Locale,
  path: string,
): string | undefined {
  const prefixed = withLocalePrefix(locale, path);
  if (origin) return `${origin}${prefixed}`;
  return absolutePublicUrl(prefixed);
}

export function hreflangAlternates(
  origin: string | undefined,
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  const he = localizedAbsoluteUrl(origin, "he", path);
  const en = localizedAbsoluteUrl(origin, "en", path);
  const canonical = localizedAbsoluteUrl(origin, locale, path);
  return {
    ...(canonical ? { canonical } : {}),
    languages: {
      ...(he ? { "he-IL": he, "x-default": he } : {}),
      ...(en ? { "en-US": en } : {}),
    },
  };
}

type PublicPageMetaInput = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
};

/** Shared Open Graph, Twitter, canonical, and hreflang for public static pages */
export async function buildPublicPageMetadata({
  title,
  description,
  path,
  locale,
}: PublicPageMetaInput): Promise<Metadata> {
  const [publicOrigin, crawlerOrigin] = await Promise.all([
    resolvePublicOrigin(),
    resolveCrawlerOrigin(),
  ]);
  const origin = publicOrigin ?? crawlerOrigin;
  const metadataBase = publicOrigin ? new URL(publicOrigin) : undefined;
  const canonical = localizedAbsoluteUrl(origin, locale, path);
  const siteName = locale === "he" ? "לב ארי הפקות" : "Lev Ari Productions";

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: hreflangAlternates(origin, path, locale),
    ...googleVerificationMetadata(),
    robots: { index: true, follow: true },
    icons: SITE_ICONS,
    openGraph: {
      title,
      description,
      type: "website",
      siteName,
      ...localeOpenGraph(locale),
      images: [SITE_SHARE_IMAGE],
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_SHARE_IMAGE.url],
    },
  };
}

/** Homepage metadata for the request locale, with CMS overrides */
export async function buildHomeMetadata(): Promise<Metadata> {
  const [cmsMap, locale, publicOrigin, crawlerOrigin] = await Promise.all([
    getSiteContentMap(),
    getRequestLocale(),
    resolvePublicOrigin(),
    resolveCrawlerOrigin(),
  ]);
  const origin = publicOrigin ?? crawlerOrigin;
  const metadataBase = publicOrigin ? new URL(publicOrigin) : undefined;
  const canonical = localizedAbsoluteUrl(origin, locale, "/");

  const title = resolveSeoTitle(cmsMap, locale);
  const description = resolveSeoDescription(cmsMap, locale);
  const siteName = locale === "he" ? "לב ארי הפקות" : "Lev Ari Productions";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: hreflangAlternates(origin, "/", locale),
    ...googleVerificationMetadata(),
    robots: { index: true, follow: true },
    icons: SITE_ICONS,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      ...localeOpenGraph(locale),
      images: [SITE_SHARE_IMAGE],
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_SHARE_IMAGE.url],
    },
  };
}
