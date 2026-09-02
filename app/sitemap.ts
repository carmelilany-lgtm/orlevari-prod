import { PUBLIC_PAGE_PATHS, withLocalePrefix } from "@/lib/i18n/locale-path";
import { LOCALES, type Locale } from "@/types/i18n";
import { getSiteUrl, resolveCrawlerOrigin } from "@/lib/seo/site-url";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const PATH_PRIORITY: Record<string, number> = {
  "/": 1,
  "/privacy-policy": 0.5,
  "/accessibility-statement": 0.5,
};

function languageMap(
  base: string,
  path: string,
): Record<string, string> {
  return {
    "he-IL": `${base}${withLocalePrefix("he", path)}`,
    "en-US": `${base}${withLocalePrefix("en", path)}`,
    "x-default": `${base}${withLocalePrefix("en", path)}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await resolveCrawlerOrigin()) || getSiteUrl();
  if (!base) return [];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PAGE_PATHS) {
    const priority = PATH_PRIORITY[path] ?? 0.5;
    const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
      path === "/" ? "weekly" : "yearly";
    const languages = languageMap(base, path);

    for (const locale of LOCALES as Locale[]) {
      entries.push({
        url: `${base}${withLocalePrefix(locale, path)}`,
        changeFrequency,
        priority: locale === "he" ? priority : Math.max(0.4, priority - 0.1),
        alternates: { languages },
      });
    }
  }

  return entries;
}
