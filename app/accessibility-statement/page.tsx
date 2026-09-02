import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import { getAccessibilityStatementContent } from "@/lib/i18n/legal-content";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { translations } from "@/lib/i18n/translations";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const content = getAccessibilityStatementContent(locale);
  return buildPublicPageMetadata({
    title: `${content.title} | ${translations[locale].brand}`,
    description: content.intro,
    path: "/accessibility-statement",
  });
}

export default async function AccessibilityStatementPage() {
  const initialLocale = await getRequestLocale();

  return (
    <AppProviders initialLocale={initialLocale}>
      <LegalPageClient kind="accessibility" />
    </AppProviders>
  );
}
