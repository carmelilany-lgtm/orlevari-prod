import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/api/content";
import { resolveCmsText } from "@/lib/i18n/cms";
import { absolutePublicUrl, getMetadataBase } from "@/lib/seo/site-url";

const DEFAULT_TITLE = "Lev Ari Productions | לב ארי הפקות";
const DEFAULT_DESCRIPTION =
  "Cinematic video production for businesses, events & artists. הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.";

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

/** English-default homepage metadata with CMS overrides */
export async function buildHomeMetadata(): Promise<Metadata> {
  const cmsMap = await getSiteContentMap();
  const metadataBase = getMetadataBase();

  const title = resolveCmsText(
    cmsMap,
    "seo_title_en",
    "en",
    DEFAULT_TITLE,
  );
  const description = resolveCmsText(
    cmsMap,
    "seo_description_en",
    "en",
    DEFAULT_DESCRIPTION,
  );

  const canonical = absolutePublicUrl("/");

  return {
    title: {
      default: title,
      template: "%s | Lev Ari Productions",
    },
    description,
    ...(metadataBase ? { metadataBase } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      siteName: "Lev Ari Productions",
      type: "website",
      locale: "en_US",
      alternateLocale: ["he_IL"],
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
