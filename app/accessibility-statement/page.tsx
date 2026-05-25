import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import { buildPublicPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPublicPageMetadata({
  title: "Accessibility Statement",
  description:
    "Accessibility efforts, known limitations, and how to report issues on the Lev Ari Productions website.",
  path: "/accessibility-statement",
});

export default function AccessibilityStatementPage() {
  return (
    <AppProviders>
      <LegalPageClient kind="accessibility" />
    </AppProviders>
  );
}
