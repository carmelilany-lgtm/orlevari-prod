export const WHATSAPP_SITE_CONTENT_KEYS = [
  "whatsapp_number",
  "whatsapp_message_en",
  "whatsapp_message_he",
  "whatsapp_enabled",
  "whatsapp_floating_enabled",
] as const;

export type WhatsAppSiteContentKey = (typeof WHATSAPP_SITE_CONTENT_KEYS)[number];

export type WhatsAppFieldKind =
  | "phone"
  | "message_en"
  | "message_he"
  | "boolean";

export interface WhatsAppFieldMeta {
  label: string;
  kind: WhatsAppFieldKind;
  helper?: string;
}

export const WHATSAPP_FIELD_META: Record<WhatsAppSiteContentKey, WhatsAppFieldMeta> =
  {
  whatsapp_number: {
    label: "מספר WhatsApp",
    kind: "phone",
    helper: "מומלץ להזין מספר בפורמט בינלאומי, לדוגמה 972501234567",
  },
  whatsapp_message_en: {
    label: "הודעת WhatsApp באנגלית",
    kind: "message_en",
  },
  whatsapp_message_he: {
    label: "הודעת WhatsApp בעברית",
    kind: "message_he",
  },
  whatsapp_enabled: {
    label: "הצגת WhatsApp באזור צור קשר",
    kind: "boolean",
  },
  whatsapp_floating_enabled: {
    label: "הצגת כפתור WhatsApp צף",
    kind: "boolean",
  },
  };

export function isWhatsAppContentKey(key: string): key is WhatsAppSiteContentKey {
  return (WHATSAPP_SITE_CONTENT_KEYS as readonly string[]).includes(key);
}

export function parseStoredBoolean(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function booleanToStored(enabled: boolean): string {
  return enabled ? "true" : "false";
}
