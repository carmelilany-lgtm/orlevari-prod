/** Strip non-digits from a phone string */
export function stripPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Normalize for WhatsApp wa.me links.
 * Israeli local numbers starting with 0 → 972 prefix when length suggests mobile/landline.
 */
export function normalizePhoneForWhatsApp(number: string): string {
  const digits = stripPhoneDigits(number);
  if (!digits) return "";

  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 10) {
    return `972${digits.slice(1)}`;
  }
  return digits;
}

export function buildTelHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const digits = stripPhoneDigits(trimmed);
  if (!digits) return null;
  return `tel:${digits}`;
}

export function buildMailtoHref(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes("@")) return null;
  return `mailto:${trimmed}`;
}

export function isValidWhatsAppDigits(normalized: string): boolean {
  return normalized.length >= 7 && normalized.length <= 15;
}

export function buildWhatsAppHref(
  number: string,
  message?: string,
): string | null {
  const normalized = normalizePhoneForWhatsApp(number);
  if (!normalized || !isValidWhatsAppDigits(normalized)) return null;

  const base = `https://wa.me/${normalized}`;
  const text = message?.trim();
  if (!text) return base;

  return `${base}?text=${encodeURIComponent(text)}`;
}
