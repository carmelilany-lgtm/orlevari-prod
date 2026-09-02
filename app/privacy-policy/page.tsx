import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPublicPageMetadata({
  title: "Privacy Policy",
  description:
    "How Lev Ari Productions collects and uses information on the public website and contact form.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const initialLocale = await getRequestLocale();

  return (
    <AppProviders initialLocale={initialLocale}>
      <LegalPageClient kind="privacy" />
    </AppProviders>
  );
}
