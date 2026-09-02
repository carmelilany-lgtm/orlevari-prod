export type Locale = "en" | "he";

export const LOCALES: Locale[] = ["en", "he"];

/** First visit and unprefixed URLs (`/` → `/en`). */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "lev-ari-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
