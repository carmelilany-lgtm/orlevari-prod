import "server-only";

import { SERVICES } from "@/data/services";
import type { Language } from "@/types/language";
import {
  buildTelHref,
  buildWhatsAppUrl,
  createEmailButton,
  escapeHtml,
  formatDate,
  formatOptionalValue,
  wrapEmailDocument,
} from "@/lib/resend/templates/utils";

export interface LeadNotificationData {
  full_name: string;
  phone: string;
  email: string;
  service_type: string | null;
  message: string | null;
  language: Language;
  created_at: string;
}

function formatServiceLabel(serviceType: string | null, language: Language): string {
  if (!serviceType?.trim()) {
    return "-";
  }

  const service = SERVICES.find((s) => s.id === serviceType.trim());
  if (service) {
    return escapeHtml(service.title[language]);
  }

  return escapeHtml(serviceType.trim());
}

function languageLabel(language: Language): string {
  return language === "he" ? "עברית (Hebrew)" : "English";
}

export function buildLeadNotificationEmail(lead: LeadNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "New lead from Lev Ari Productions website";
  const safeName = escapeHtml(lead.full_name.trim());
  const safePhone = escapeHtml(lead.phone.trim());
  const safeEmail = escapeHtml(lead.email.trim());
  const mailto = `mailto:${encodeURIComponent(lead.email.trim())}`;
  const telHref = buildTelHref(lead.phone);
  const whatsappUrl = buildWhatsAppUrl(lead.phone);

  const actionButtons = [
    createEmailButton(mailto, "Email customer"),
    ...(telHref ? [createEmailButton(telHref, "Call")] : []),
    ...(whatsappUrl
      ? [createEmailButton(whatsappUrl, "WhatsApp")]
      : []),
  ].join("");

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;">New website lead</h1>
    <p style="margin:0 0 20px;color:#475569;">פנייה חדשה מהאתר של לב ארי הפקות</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;"><strong style="color:#334155;">Name / שם:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;">${safeName}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Phone / טלפון:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;">${safePhone}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Email / אימייל:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;"><a href="${escapeHtml(mailto)}" style="color:#1d4ed8;">${safeEmail}</a></td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Service / שירות:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;">${formatServiceLabel(lead.service_type, lead.language)}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Language / שפה:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;">${escapeHtml(languageLabel(lead.language))}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Submitted / נשלח:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;border-bottom:1px solid #e2e8f0;">${formatDate(lead.created_at, "en")}</td></tr>
      <tr><td style="padding:8px 0;"><strong style="color:#334155;">Message / הודעה:</strong></td></tr>
      <tr><td style="padding:8px 0 16px;white-space:pre-wrap;">${formatOptionalValue(lead.message, lead.language === "he" ? "לא נכתבה הודעה." : "No message provided.")}</td></tr>
    </table>
    <p style="margin:0 0 12px;font-size:14px;color:#475569;">Quick actions:</p>
    <p style="margin:0 0 24px;">${actionButtons}</p>
    <p style="margin:0;font-size:13px;color:#64748b;">Source: Lev Ari Productions website<br />This lead was submitted through Lev Ari Productions website.</p>
  `;

  const html = wrapEmailDocument({
    lang: "en",
    dir: "ltr",
    title: subject,
    bodyHtml,
  });

  const text = [
    "New website lead - Lev Ari Productions",
    "",
    `Name: ${lead.full_name.trim()}`,
    `Phone: ${lead.phone.trim()}`,
    `Email: ${lead.email.trim()}`,
    `Service: ${lead.service_type?.trim() || "-"}`,
    `Language: ${languageLabel(lead.language)}`,
    `Submitted: ${lead.created_at}`,
    `Message: ${lead.message?.trim() || "No message provided."}`,
    "",
    "Source: Lev Ari Productions website",
  ].join("\n");

  return { subject, html, text };
}
