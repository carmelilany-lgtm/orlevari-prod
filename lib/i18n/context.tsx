"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getCmsRawValue, resolveCmsText } from "@/lib/i18n/cms";
import { translations, type TranslationKeys } from "@/lib/i18n/translations";
import type { SiteContentKey, SiteContentMap } from "@/types/content";
import {
  readLocaleFromStorage,
  writeLocaleToStorage,
} from "@/lib/i18n/locale-storage";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "@/types/i18n";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: TranslationKeys;
  cmsMap?: SiteContentMap;
  /** True when homepage loaded from Supabase (not mock fallback) */
  isLiveData: boolean;
  whatsappEnvFallback?: string;
  cms: (key: SiteContentKey, fallback: string) => string;
  cmsRaw: (key: SiteContentKey) => string | null;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  const dir = locale === "he" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
}

const localeListeners = new Set<() => void>();

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    localeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getLocaleSnapshot(): Locale {
  return readLocaleFromStorage();
}

function persistLocale(locale: Locale) {
  writeLocaleToStorage(locale);
  applyDocumentLocale(locale);
  localeListeners.forEach((listener) => listener());
}

export function LanguageProvider({
  children,
  cmsMap,
  isLiveData = false,
  whatsappEnvFallback,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  cmsMap?: SiteContentMap;
  isLiveData?: boolean;
  whatsappEnvFallback?: string;
  initialLocale?: Locale;
}) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => initialLocale,
  );

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
  }, []);

  const cms = useCallback(
    (key: SiteContentKey, fallback: string) =>
      resolveCmsText(cmsMap, key, locale, fallback),
    [cmsMap, locale],
  );

  const cmsRaw = useCallback(
    (key: SiteContentKey) => getCmsRawValue(cmsMap, key, locale),
    [cmsMap, locale],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === "he" ? "rtl" : "ltr",
      t: translations[locale],
      cmsMap,
      isLiveData,
      whatsappEnvFallback,
      cms,
      cmsRaw,
      setLocale,
    }),
    [locale, setLocale, cmsMap, isLiveData, whatsappEnvFallback, cms, cmsRaw],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
