import type { Metadata } from "next";
import { getSiteContentMap } from "@/lib/api/content";
import { resolveCmsText } from "@/lib/i18n/cms";

const DEFAULT_TITLE = "Lev Ari Productions | לב ארי הפקות";
const DEFAULT_DESCRIPTION =
  "Cinematic video production for businesses, events & artists. הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.";

function siteMetadataBase(): URL | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url) return undefined;
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

/** English-default homepage metadata with CMS overrides */
export async function buildHomeMetadata(): Promise<Metadata> {
  const cmsMap = await getSiteContentMap();
  const metadataBase = siteMetadataBase();

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

  return {
    title: {
      default: title,
      template: "%s | Lev Ari Productions",
    },
    description,
    ...(metadataBase ? { metadataBase } : {}),
    openGraph: {
      title,
      description,
      siteName: "Lev Ari Productions",
      type: "website",
      locale: "en_US",
      alternateLocale: ["he_IL"],
      ...(metadataBase ? { url: metadataBase } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
