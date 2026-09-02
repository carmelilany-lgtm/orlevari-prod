import { cookies, headers } from "next/headers";
import { cache } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_REQUEST_HEADER,
  localeFromHeaderValue,
} from "@/lib/i18n/locale-path";
import { LOCALE_STORAGE_KEY, isLocale, type Locale } from "@/types/i18n";

/** URL prefix (middleware header), then cookie, then Hebrew default. */
export const getRequestLocale = cache(async (): Promise<Locale> => {
  const headerLocale = localeFromHeaderValue(
    (await headers()).get(LOCALE_REQUEST_HEADER),
  );
  if (headerLocale) return headerLocale;

  const store = await cookies();
  const value = store.get(LOCALE_STORAGE_KEY)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
});
