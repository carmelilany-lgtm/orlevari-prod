"use client";

import {
  buildMailtoHref,
  buildTelHref,
  buildWhatsAppHref,
} from "@/lib/contact/links";
import { useLanguage } from "@/lib/i18n/context";
import { useMemo } from "react";

export interface PublicContactLink {
  kind: "phone" | "email" | "whatsapp";
  label: string;
  href: string;
  value: string;
}

const MOCK_DEV_WHATSAPP = "972500000000";

export function usePublicContactLinks(): PublicContactLink[] {
  const { locale, t, cmsRaw, isLiveData, whatsappEnvFallback } = useLanguage();

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
        value: phone,
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

    const waNumber =
      cmsRaw("whatsapp_number")?.trim() ||
      whatsappEnvFallback?.trim() ||
      (!isLiveData ? MOCK_DEV_WHATSAPP : undefined);

    if (waNumber) {
      const messageKey =
        locale === "he" ? "whatsapp_message_he" : "whatsapp_message_en";
      const message = cmsRaw(messageKey) ?? undefined;
      const waHref = buildWhatsAppHref(waNumber, message);
      if (waHref) {
        links.push({
          kind: "whatsapp",
          label: t.contact.links.whatsapp,
          href: waHref,
          value: t.contact.links.whatsapp,
        });
      }
    }

    return links;
  }, [locale, t, cmsRaw, isLiveData, whatsappEnvFallback]);
}

export function useFloatingWhatsAppHref(): string | null {
  const { locale, cmsRaw, isLiveData, whatsappEnvFallback } = useLanguage();

  return useMemo(() => {
    const waNumber =
      cmsRaw("whatsapp_number")?.trim() ||
      whatsappEnvFallback?.trim() ||
      (!isLiveData ? MOCK_DEV_WHATSAPP : undefined);

    if (!waNumber) return null;

    const messageKey =
      locale === "he" ? "whatsapp_message_he" : "whatsapp_message_en";
    const message = cmsRaw(messageKey) ?? undefined;
    return buildWhatsAppHref(waNumber, message);
  }, [locale, cmsRaw, isLiveData, whatsappEnvFallback]);
}
