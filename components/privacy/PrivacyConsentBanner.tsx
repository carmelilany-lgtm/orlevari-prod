"use client";

import { useLanguage } from "@/lib/i18n/context";
import { PRIVACY_BANNER_ID } from "@/lib/privacy/consent";
import {
  getPrivacyConsentServerSnapshot,
  getPrivacyConsentSnapshot,
  setPrivacyConsent,
  subscribePrivacyConsent,
} from "@/lib/privacy/store";
import Link from "next/link";
import { useSyncExternalStore } from "react";

export function PrivacyConsentBanner() {
  const { t, dir } = useLanguage();
  const consent = useSyncExternalStore(
    subscribePrivacyConsent,
    getPrivacyConsentSnapshot,
    getPrivacyConsentServerSnapshot,
  );

  if (consent.decided) return null;

  const copy = t.privacyBanner;

  return (
    <div
      id={PRIVACY_BANNER_ID}
      className="fixed inset-x-0 bottom-0 z-[45] border-t border-blue-500/25 bg-[#0a1020]/95 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-6"
      role="dialog"
      aria-labelledby="privacy-banner-title"
      aria-describedby="privacy-banner-body"
      dir={dir}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 text-start">
          <p
            id="privacy-banner-title"
            className="text-sm font-semibold text-white"
          >
            {copy.title}
          </p>
          <p
            id="privacy-banner-body"
            className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-400"
          >
            {copy.body}{" "}
            <Link
              href="/privacy-policy"
              className="text-cyan-300/90 underline underline-offset-2 hover:text-cyan-200"
            >
              {copy.policy}
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <button
            type="button"
            className="rounded-lg border border-blue-800/60 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-500/40 hover:text-white"
            onClick={() => setPrivacyConsent(false)}
          >
            {copy.necessary}
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            onClick={() => setPrivacyConsent(true)}
          >
            {copy.acceptAnalytics}
          </button>
        </div>
      </div>
    </div>
  );
}
