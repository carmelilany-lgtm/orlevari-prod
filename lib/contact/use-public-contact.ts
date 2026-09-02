"use client";

import {
  buildMailtoHref,
  buildTelHref,
  formatPhoneForDisplay,
} from "@/lib/contact/links";
import { resolveWhatsAppPublicSettings } from "@/lib/contact/whatsapp-settings";
import { useLanguage } from "@/lib/i18n/context";
import { useMemo } from "react";

export interface PublicContactLink {
  kind: "phone" | "email";
  label: string;
  href: string;
  value: string;
}

export function useWhatsAppPublicSettings() {
  const { locale, cmsMap, isLiveData, whatsappEnvFallback } = useLanguage();

  return useMemo(
    () =>
      resolveWhatsAppPublicSettings({
        locale,
        cmsMap,
        whatsappEnvFallback,
        isLiveData,
      }),
    [locale, cmsMap, whatsappEnvFallback, isLiveData],
  );
}

export function usePublicContactLinks(): PublicContactLink[] {
  const { t, cmsRaw, isLiveData } = useLanguage();

  return useMemo(() => {
    const links: PublicContactLink[] = [];

    const phone = isLiveData
      ? cmsRaw("phone")
      : cmsRaw("phone") ?? t.contact.placeholders.phone;
    const phoneHref = phone ? buildTelHref(phone) : null;
    if (phone && phoneHref) {
      links.push({
        kind: "phone",
        label: t.contact.links.phone,
        href: phoneHref,
        value: formatPhoneForDisplay(phone),
      });
    }

    const email = isLiveData
      ? cmsRaw("email")
      : cmsRaw("email") ?? t.contact.placeholders.email;
    const emailHref = email ? buildMailtoHref(email) : null;
    if (email && emailHref) {
      links.push({
        kind: "email",
        label: t.contact.links.email,
        href: emailHref,
        value: email,
      });
    }

    return links;
  }, [t, cmsRaw, isLiveData]);
}

export function useFloatingWhatsAppHref(): string | null {
  const whatsapp = useWhatsAppPublicSettings();

  if (!whatsapp.floatingEnabled || !whatsapp.href) {
    return null;
  }

  return whatsapp.href;
}
