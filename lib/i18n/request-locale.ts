import { cookies } from "next/headers";
import { cache } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  type Locale,
} from "@/types/i18n";

/** Cookie + storage key; used by SSR so the first paint matches the saved language. */
export const getRequestLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const value = store.get(LOCALE_STORAGE_KEY)?.value;
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
});
