import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import { getPrivacyPolicyContent } from "@/lib/i18n/legal-content";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";
import { translations } from "@/lib/i18n/translations";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const content = getPrivacyPolicyContent(locale);
  return buildPublicPageMetadata({
    title: `${content.title} | ${translations[locale].brand}`,
    description: content.intro,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage() {
  const initialLocale = await getRequestLocale();

  return (
    <AppProviders initialLocale={initialLocale}>
      <LegalPageClient kind="privacy" />
    </AppProviders>
  );
}
