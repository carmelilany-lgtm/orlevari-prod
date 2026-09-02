export type Locale = "en" | "he";

export const LOCALES: Locale[] = ["en", "he"];

/** Hebrew-first: Google and first visits without a locale prefix. */
export const DEFAULT_LOCALE: Locale = "he";

export const LOCALE_STORAGE_KEY = "lev-ari-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
