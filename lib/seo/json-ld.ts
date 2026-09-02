import { resolveCmsSetting } from "@/lib/i18n/cms";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { resolveSeoDescription } from "@/lib/seo/document-title";
import type { SiteContentMap } from "@/types/content";
import type { Locale } from "@/types/i18n";

function jsonLdText(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildHomeJsonLd(input: {
  origin: string | undefined;
  locale: Locale;
  cmsMap: SiteContentMap | undefined;
}): object {
  const { origin, locale, cmsMap } = input;
  const name = locale === "he" ? "לב ארי הפקות" : "Lev Ari Productions";
  const alternateName =
    locale === "he" ? "Lev Ari Productions" : "לב ארי הפקות";
  const pageUrl = origin
    ? `${origin}${withLocalePrefix(locale, "/")}`
    : withLocalePrefix(locale, "/");
  const heUrl = origin
    ? `${origin}${withLocalePrefix("he", "/")}`
    : withLocalePrefix("he", "/");
  const enUrl = origin
    ? `${origin}${withLocalePrefix("en", "/")}`
    : withLocalePrefix("en", "/");
  const description = resolveSeoDescription(cmsMap, locale);
  const telephone = resolveCmsSetting(cmsMap, "phone", "").trim();
  const email = resolveCmsSetting(cmsMap, "email", "").trim();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#business`,
        name,
        alternateName,
        url: pageUrl,
        description,
        inLanguage: locale === "he" ? "he-IL" : "en-US",
        image: origin ? `${origin}/og-image.png` : undefined,
        logo: origin ? `${origin}/icon-192.png` : undefined,
        telephone: telephone || undefined,
        email: email || undefined,
        areaServed: {
          "@type": "Country",
          name: locale === "he" ? "ישראל" : "Israel",
        },
        knowsLanguage: ["he", "en"],
      },
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        name,
        alternateName,
        url: pageUrl,
        inLanguage: locale === "he" ? "he-IL" : "en-US",
        publisher: { "@id": `${pageUrl}#business` },
        description,
        hasPart: [
          { "@type": "WebPage", url: heUrl, inLanguage: "he-IL" },
          { "@type": "WebPage", url: enUrl, inLanguage: "en-US" },
        ],
      },
    ],
  };
}

export function jsonLdScriptHtml(data: unknown): string {
  return jsonLdText(data);
}

export function buildWebPageJsonLd(input: {
  origin: string | undefined;
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): object {
  const { origin, locale, path, title, description } = input;
  const url = origin
    ? `${origin}${withLocalePrefix(locale, path)}`
    : withLocalePrefix(locale, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    inLanguage: locale === "he" ? "he-IL" : "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: locale === "he" ? "לב ארי הפקות" : "Lev Ari Productions",
      url: origin
        ? `${origin}${withLocalePrefix(locale, "/")}`
        : withLocalePrefix(locale, "/"),
    },
  };
}
