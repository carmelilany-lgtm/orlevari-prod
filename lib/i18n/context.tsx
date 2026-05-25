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
import { resolveCmsText } from "@/lib/i18n/cms";
import { translations, type TranslationKeys } from "@/lib/i18n/translations";
import type { SiteContentKey, SiteContentMap } from "@/types/content";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/types/i18n";
import { isLocale } from "@/types/i18n";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: TranslationKeys;
  cmsMap?: SiteContentMap;
  cms: (key: SiteContentKey, fallback: string) => string;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  const dir = locale === "he" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
}

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;
  return DEFAULT_LOCALE;
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
  return readStoredLocale();
}

function getLocaleServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function persistLocale(locale: Locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  applyDocumentLocale(locale);
  localeListeners.forEach((listener) => listener());
}

export function LanguageProvider({
  children,
  cmsMap,
}: {
  children: ReactNode;
  cmsMap?: SiteContentMap;
}) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getLocaleServerSnapshot,
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

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === "he" ? "rtl" : "ltr",
      t: translations[locale],
      cmsMap,
      cms,
      setLocale,
    }),
    [locale, setLocale, cmsMap, cms],
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
