"use client";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { PrivacyPreferencesCard } from "@/components/privacy/PrivacyPreferencesCard";
import { LegalPageChrome } from "@/components/layout/LegalPageChrome";
import {
  getAccessibilityStatementContent,
  getPrivacyPolicyContent,
  type LegalPageContent,
} from "@/lib/i18n/legal-content";
import { useLanguage } from "@/lib/i18n/context";

type LegalPageKind = "privacy" | "accessibility";

function resolveContent(
  kind: LegalPageKind,
  locale: "en" | "he",
): LegalPageContent {
  if (kind === "privacy") return getPrivacyPolicyContent(locale);
  return getAccessibilityStatementContent(locale);
}

export function LegalPageClient({ kind }: { kind: LegalPageKind }) {
  const { locale } = useLanguage();
  const content = resolveContent(kind, locale);

  return (
    <LegalPageChrome>
      <LegalDocument content={content} />
      {kind === "privacy" ? <PrivacyPreferencesCard /> : null}
    </LegalPageChrome>
  );
}
