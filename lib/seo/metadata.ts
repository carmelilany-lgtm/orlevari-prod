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
import { absolutePublicUrl, resolvePublicOrigin } from "@/lib/seo/site-url";

const DEFAULT_TITLE = `${DEFAULT_SEO_TITLE_EN} | ${DEFAULT_SEO_TITLE_HE}`;
const DEFAULT_DESCRIPTION = `${DEFAULT_SEO_DESCRIPTION_EN} ${DEFAULT_SEO_DESCRIPTION_HE}`;

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
  alt: "Lev Ari Productions",
} as const;

type PublicPageMetaInput = {
  title: string;
  description: string;
  path: string;
};

/** Shared Open Graph, Twitter, and canonical for public static pages */
export async function buildPublicPageMetadata({
  title,
  description,
  path,
}: PublicPageMetaInput): Promise<Metadata> {
  const origin = await resolvePublicOrigin();
  const metadataBase = origin ? new URL(origin) : undefined;
  const canonical = origin
    ? `${origin}${path.startsWith("/") ? path : `/${path}`}`
    : absolutePublicUrl(path);

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    icons: SITE_ICONS,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Lev Ari Productions",
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
  const [cmsMap, locale, origin] = await Promise.all([
    getSiteContentMap(),
    getRequestLocale(),
    resolvePublicOrigin(),
  ]);
  const metadataBase = origin ? new URL(origin) : undefined;
  const canonical = origin ? `${origin}/` : undefined;

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
    ...(canonical ? { alternates: { canonical } } : {}),
    icons: SITE_ICONS,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      locale: locale === "he" ? "he_IL" : "en_US",
      alternateLocale: [locale === "he" ? "en_US" : "he_IL"],
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
