import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/types/i18n";

/** Resolve stored preference; unknown/missing values fall back to English. */
export function resolveStoredLocale(stored: string | null | undefined): Locale {
  if (stored && isLocale(stored)) {
    return stored;
  }
  return DEFAULT_LOCALE;
}

export function readLocaleFromStorage(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    return resolveStoredLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeLocaleToStorage(locale: Locale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/** Runs before paint so html lang/dir match saved preference (or English default). */
export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(LOCALE_STORAGE_KEY)};var s=localStorage.getItem(k);var l=(s==="en"||s==="he")?s:${JSON.stringify(DEFAULT_LOCALE)};document.documentElement.lang=l;document.documentElement.dir=l==="he"?"rtl":"ltr";}catch(e){}})();`;
