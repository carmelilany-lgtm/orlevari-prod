import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/types/i18n";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Resolve stored preference; unknown/missing values fall back to English. */
export function resolveStoredLocale(stored: string | null | undefined): Locale {
  if (stored && isLocale(stored)) {
    return stored;
  }
  return DEFAULT_LOCALE;
}

function readLocaleFromDocumentCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const prefix = `${LOCALE_STORAGE_KEY}=`;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(prefix));
  if (!match) return null;
  return resolveStoredLocale(decodeURIComponent(match.slice(prefix.length)));
}

export function readLocaleFromStorage(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const fromStorage = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (fromStorage && isLocale(fromStorage)) {
      return fromStorage;
    }
  } catch {
    /* private mode */
  }

  return readLocaleFromDocumentCookie() ?? DEFAULT_LOCALE;
}

export function writeLocaleToStorage(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* private mode */
  }
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Runs before paint so html lang/dir and the locale cookie match the saved preference. */
export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(LOCALE_STORAGE_KEY)};var l=null;try{var s=localStorage.getItem(k);if(s==="en"||s==="he")l=s;}catch(e){}if(!l){var p=k+"=";var c=document.cookie.split("; ").find(function(x){return x.indexOf(p)===0});if(c){var v=decodeURIComponent(c.slice(p.length));if(v==="en"||v==="he")l=v;}}if(!l)l=${JSON.stringify(DEFAULT_LOCALE)};try{localStorage.setItem(k,l);}catch(e){}document.cookie=k+"="+l+"; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax";document.documentElement.lang=l;document.documentElement.dir=l==="he"?"rtl":"ltr";}catch(e){}})();`;
