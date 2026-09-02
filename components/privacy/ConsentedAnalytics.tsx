"use client";

import { Analytics } from "@vercel/analytics/next";
import {
  getPrivacyConsentServerSnapshot,
  getPrivacyConsentSnapshot,
  subscribePrivacyConsent,
} from "@/lib/privacy/store";
import { useSyncExternalStore } from "react";

export function ConsentedAnalytics() {
  const consent = useSyncExternalStore(
    subscribePrivacyConsent,
    getPrivacyConsentSnapshot,
    getPrivacyConsentServerSnapshot,
  );

  if (!consent.analytics) return null;
  return <Analytics />;
}
