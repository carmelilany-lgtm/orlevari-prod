"use client";

import { useLanguage } from "@/lib/i18n/context";
import {
  getPrivacyConsentServerSnapshot,
  getPrivacyConsentSnapshot,
  setPrivacyConsent,
  subscribePrivacyConsent,
} from "@/lib/privacy/store";
import { useSyncExternalStore } from "react";

export function PrivacyPreferencesCard() {
  const { t, dir } = useLanguage();
  const consent = useSyncExternalStore(
    subscribePrivacyConsent,
    getPrivacyConsentSnapshot,
    getPrivacyConsentServerSnapshot,
  );
  const copy = t.privacyBanner;

  return (
    <section
      className="mt-10 rounded-2xl border border-blue-900/40 bg-[#0a1020]/60 p-5"
      dir={dir}
      aria-labelledby="privacy-prefs-title"
    >
      <h2
        id="privacy-prefs-title"
        className="text-lg font-semibold text-slate-100"
      >
        {copy.manageTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {copy.manageBody}
      </p>
      <p className="mt-3 text-sm text-slate-300">
        {copy.analyticsStatus}:{" "}
        <strong>
          {consent.analytics ? copy.analyticsOn : copy.analyticsOff}
        </strong>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-blue-800/60 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-500/40"
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
    </section>
  );
}
