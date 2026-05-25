import { buildWhatsAppHref, normalizePhoneForWhatsApp } from "@/lib/contact/links";
import type { SiteContentKey, SiteContentMap } from "@/types/content";
import type { Locale } from "@/types/i18n";

export const DEFAULT_WHATSAPP_MESSAGE_EN =
  "Hi, I'd like to ask about a video production project.";
export const DEFAULT_WHATSAPP_MESSAGE_HE =
  "שלום, אשמח לקבל פרטים לגבי הפקת וידאו.";

/** Dev-only mock when Supabase is not configured */
export const DEV_MOCK_WHATSAPP_NUMBER = "972500000000";

export function parseCmsBoolean(
  value: string | null | undefined,
  defaultValue = true,
): boolean {
  if (value == null || value.trim() === "") {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }
  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return defaultValue;
}

export function getSharedCmsValue(
  map: SiteContentMap | undefined,
  key: SiteContentKey,
): string | null {
  const row = map?.[key];
  if (!row) return null;
  const en = row.value_en?.trim();
  const he = row.value_he?.trim();
  return en || he || null;
}

export function getCmsBooleanFlag(
  map: SiteContentMap | undefined,
  key: SiteContentKey,
  defaultValue = true,
): boolean {
  const row = map?.[key];
  return parseCmsBoolean(row?.value_en ?? row?.value_he ?? null, defaultValue);
}

export function resolveWhatsAppNumber(
  cmsNumber: string | null | undefined,
  envFallback?: string,
  options?: { allowDevMock?: boolean },
): string | null {
  const cms = cmsNumber?.trim();
  if (cms) return cms;

  const env = envFallback?.trim();
  if (env) return env;

  if (options?.allowDevMock) {
    return DEV_MOCK_WHATSAPP_NUMBER;
  }

  return null;
}

export function resolveWhatsAppMessage(
  locale: Locale,
  cmsMessageEn: string | null | undefined,
  cmsMessageHe: string | null | undefined,
): string {
  if (locale === "he") {
    return (
      cmsMessageHe?.trim() ||
      cmsMessageEn?.trim() ||
      DEFAULT_WHATSAPP_MESSAGE_HE
    );
  }

  return (
    cmsMessageEn?.trim() ||
    cmsMessageHe?.trim() ||
    DEFAULT_WHATSAPP_MESSAGE_EN
  );
}

export function buildPublicWhatsAppHref(
  number: string,
  message: string,
): string | null {
  return buildWhatsAppHref(number, message);
}

export function isUsableWhatsAppNumber(number: string): boolean {
  const normalized = normalizePhoneForWhatsApp(number);
  return normalized.length >= 7 && normalized.length <= 15;
}

export interface ResolvedWhatsAppPublic {
  number: string | null;
  message: string;
  href: string | null;
  contactEnabled: boolean;
  floatingEnabled: boolean;
}

export function resolveWhatsAppPublicSettings(input: {
  locale: Locale;
  cmsMap?: SiteContentMap;
  whatsappEnvFallback?: string;
  isLiveData: boolean;
}): ResolvedWhatsAppPublic {
  const { locale, cmsMap, whatsappEnvFallback, isLiveData } = input;

  const contactEnabled = getCmsBooleanFlag(cmsMap, "whatsapp_enabled", true);
  const floatingEnabled = getCmsBooleanFlag(
    cmsMap,
    "whatsapp_floating_enabled",
    true,
  );

  const rawNumber = resolveWhatsAppNumber(
    getSharedCmsValue(cmsMap, "whatsapp_number"),
    whatsappEnvFallback,
    { allowDevMock: !isLiveData },
  );

  const number =
    rawNumber && isUsableWhatsAppNumber(rawNumber) ? rawNumber : null;

  const message = resolveWhatsAppMessage(
    locale,
    getSharedCmsValue(cmsMap, "whatsapp_message_en"),
    getSharedCmsValue(cmsMap, "whatsapp_message_he"),
  );

  const href = number ? buildPublicWhatsAppHref(number, message) : null;

  return {
    number,
    message,
    href,
    contactEnabled,
    floatingEnabled,
  };
}
