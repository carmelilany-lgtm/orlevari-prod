import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPrivacyPolicyContent } from "@/lib/i18n/legal-content";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { resolveCrawlerOrigin } from "@/lib/seo/site-url";
import { translations } from "@/lib/i18n/translations";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const content = getPrivacyPolicyContent(locale);
  return buildPublicPageMetadata({
    title: `${content.title} | ${translations[locale].brand}`,
    description: content.intro,
    path: "/privacy-policy",
    locale,
  });
}

export default async function PrivacyPolicyPage() {
  const [initialLocale, origin] = await Promise.all([
    getRequestLocale(),
    resolveCrawlerOrigin(),
  ]);
  const content = getPrivacyPolicyContent(initialLocale);

  return (
    <AppProviders initialLocale={initialLocale}>
      <JsonLd
        data={buildWebPageJsonLd({
          origin,
          locale: initialLocale,
          path: "/privacy-policy",
          title: content.title,
          description: content.intro,
        })}
      />
      <LegalPageClient kind="privacy" />
    </AppProviders>
  );
}
