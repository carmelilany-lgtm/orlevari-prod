import "server-only";

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape user-generated values for HTML email bodies */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function formatOptionalValue(
  value: string | null | undefined,
  emptyLabel = "—",
): string {
  const trimmed = value?.trim();
  return trimmed ? escapeHtml(trimmed) : emptyLabel;
}

export function formatDate(iso: string, language: "en" | "he"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return escapeHtml(iso);
  }

  const locale = language === "he" ? "he-IL" : "en-GB";
  return escapeHtml(
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date),
  );
}

export function createEmailButton(
  href: string,
  label: string,
  options?: { background?: string },
): string {
  const bg = options?.background ?? "#1e3a5f";
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);

  return `<a href="${safeHref}" style="display:inline-block;margin:4px 8px 4px 0;padding:10px 16px;background:${bg};color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">${safeLabel}</a>`;
}

/** Best-effort digits-only phone for wa.me links; falls back to raw display */
export function normalizePhoneForWhatsApp(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  if (digits.startsWith("972")) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length >= 9) {
    return `972${digits.slice(1)}`;
  }

  if (digits.length >= 9 && digits.length <= 10) {
    return `972${digits}`;
  }

  return digits;
}

/** Safe tel: href from user phone input (digits and + only) */
export function buildTelHref(phone: string): string | null {
  const normalized = phone.trim().replace(/[^\d+]/g, "");
  if (!normalized) {
    return null;
  }
  return `tel:${normalized}`;
}

export function buildWhatsAppUrl(phone: string): string | null {
  const normalized = normalizePhoneForWhatsApp(phone);
  if (!normalized) {
    return null;
  }
  return `https://wa.me/${normalized}`;
}

export function wrapEmailDocument(options: {
  lang: "en" | "he";
  dir: "ltr" | "rtl";
  title: string;
  bodyHtml: string;
}): string {
  const { lang, dir, title, bodyHtml } = options;

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #cbd5e1;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:20px 24px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#e2e8f0;">Lev Ari Productions</p>
              <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">לב ארי הפקות</p>
            </td>
          </tr>
          <tr>
            <td dir="${dir}" style="padding:24px;color:#1e293b;font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
