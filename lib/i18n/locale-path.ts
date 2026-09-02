import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/types/i18n";

/** Header set by middleware so SSR matches the URL prefix (`/he`, `/en`). */
export const LOCALE_REQUEST_HEADER = "x-lev-ari-locale";

export const PUBLIC_PAGE_PATHS = [
  "/",
  "/privacy-policy",
  "/accessibility-statement",
] as const;

const LOCALE_PREFIX_RE = /^\/(he|en)(?=\/|$)/;

export function parseLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(LOCALE_PREFIX_RE);
  if (!match || !isLocale(match[1])) return null;
  return match[1];
}

/** Path without `/he` or `/en` prefix. */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX_RE, "");
  if (!stripped || stripped === "") return "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

/** `/he`, `/en/privacy-policy` */
export function withLocalePrefix(locale: Locale, pathname: string): string {
  const inner = stripLocalePrefix(pathname);
  if (inner === "/") return `/${locale}`;
  return `/${locale}${inner}`;
}

export function isPublicPagePath(pathname: string): boolean {
  const inner = stripLocalePrefix(pathname);
  return (PUBLIC_PAGE_PATHS as readonly string[]).includes(inner);
}

export function localeFromHeaderValue(
  value: string | null | undefined,
): Locale | null {
  if (!value) return null;
  return isLocale(value) ? value : null;
}

export { DEFAULT_LOCALE };
