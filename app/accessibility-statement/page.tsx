import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Accessibility efforts, known limitations, and how to report issues on the Lev Ari Productions website.",
};

export default function AccessibilityStatementPage() {
  return (
    <AppProviders>
      <LegalPageClient kind="accessibility" />
    </AppProviders>
  );
}
