import { LegalPageClient } from "@/components/legal/LegalPageClient";
import { AppProviders } from "@/components/providers/AppProviders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lev Ari Productions collects and uses information on the public website and contact form.",
};

export default function PrivacyPolicyPage() {
  return (
    <AppProviders>
      <LegalPageClient kind="privacy" />
    </AppProviders>
  );
}
