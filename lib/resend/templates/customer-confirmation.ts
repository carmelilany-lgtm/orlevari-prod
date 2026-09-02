import "server-only";

import { SERVICES } from "@/data/services";
import type { Language } from "@/types/language";
import {
  escapeHtml,
  formatOptionalValue,
  wrapEmailDocument,
} from "@/lib/resend/templates/utils";

export interface CustomerConfirmationData {
  full_name: string;
  service_type: string | null;
  message: string | null;
  language: Language;
}

function formatServiceLabel(
  serviceType: string | null,
  language: Language,
): string {
  if (!serviceType?.trim()) {
    return language === "he" ? "לא צוין" : "Not specified";
  }

  const service = SERVICES.find((s) => s.id === serviceType.trim());
  if (service) {
    return service.title[language];
  }

  return serviceType.trim();
}

export function buildCustomerConfirmationEmail(
  lead: CustomerConfirmationData,
): { subject: string; html: string; text: string } {
  const name = escapeHtml(lead.full_name.trim());
  const service = escapeHtml(formatServiceLabel(lead.service_type, lead.language));
  const emptyMessageLabel =
    lead.language === "he" ? "לא נכתבה הודעה." : "No message provided.";
  const messageBlock = lead.message?.trim()
    ? formatOptionalValue(lead.message)
    : escapeHtml(emptyMessageLabel);

  if (lead.language === "he") {
    const subject = "הפנייה שלך התקבלה - לב ארי הפקות";
    const bodyHtml = `
      <p style="margin:0 0 16px;">שלום ${name},</p>
      <p style="margin:0 0 16px;">תודה שפנית ללב ארי הפקות.<br />הפנייה שלך התקבלה בהצלחה ונחזור אליך בהקדם.</p>
      <p style="margin:0 0 8px;font-weight:600;">פרטי הפנייה:</p>
      <p style="margin:0 0 8px;"><strong>סוג שירות:</strong> ${service}</p>
      <p style="margin:0 0 24px;white-space:pre-wrap;"><strong>הודעה:</strong> ${messageBlock}</p>
      <p style="margin:0;">בברכה,<br /><strong>לב ארי הפקות</strong></p>
    `;

    const html = wrapEmailDocument({
      lang: "he",
      dir: "rtl",
      title: subject,
      bodyHtml,
    });

    const text = [
      `שלום ${lead.full_name.trim()},`,
      "",
      "תודה שפנית ללב ארי הפקות.",
      "הפנייה שלך התקבלה בהצלחה ונחזור אליך בהקדם.",
      "",
      "פרטי הפנייה:",
      `סוג שירות: ${formatServiceLabel(lead.service_type, "he")}`,
      `הודעה: ${lead.message?.trim() || "לא נכתבה הודעה."}`,
      "",
      "בברכה,",
      "לב ארי הפקות",
    ].join("\n");

    return { subject, html, text };
  }

  const subject = "We received your message - Lev Ari Productions";
  const bodyHtml = `
    <p style="margin:0 0 16px;">Hi ${name},</p>
    <p style="margin:0 0 16px;">Thank you for reaching out to Lev Ari Productions.<br />Your message was received successfully, and we'll get back to you soon.</p>
    <p style="margin:0 0 8px;font-weight:600;">Your request:</p>
    <p style="margin:0 0 8px;"><strong>Service:</strong> ${service}</p>
    <p style="margin:0 0 24px;white-space:pre-wrap;"><strong>Message:</strong> ${messageBlock}</p>
    <p style="margin:0;">Best,<br /><strong>Lev Ari Productions</strong></p>
  `;

  const html = wrapEmailDocument({
    lang: "en",
    dir: "ltr",
    title: subject,
    bodyHtml,
  });

  const text = [
    `Hi ${lead.full_name.trim()},`,
    "",
    "Thank you for reaching out to Lev Ari Productions.",
    "Your message was received successfully, and we'll get back to you soon.",
    "",
    "Your request:",
    `Service: ${formatServiceLabel(lead.service_type, "en")}`,
    `Message: ${lead.message?.trim() || "No message provided."}`,
    "",
    "Best,",
    "Lev Ari Productions",
  ].join("\n");

  return { subject, html, text };
}
