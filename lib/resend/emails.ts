import "server-only";

import { getResendClient } from "@/lib/resend/client";
import {
  getResendEnv,
  isNotificationEmailConfigured,
  isResendConfigured,
} from "@/lib/resend/env";
import { buildCustomerConfirmationEmail } from "@/lib/resend/templates/customer-confirmation";
import { buildLeadNotificationEmail } from "@/lib/resend/templates/lead-notification";
import type { Language } from "@/types/language";

export interface LeadEmailPayload {
  full_name: string;
  phone: string;
  email: string;
  service_type: string | null;
  message: string | null;
  language: Language;
  created_at: string;
}

export type EmailSendResult =
  | { ok: true; id?: string }
  | { ok: false; skipped?: boolean; reason: string };

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const resend = getResendClient();
  const { emailFrom } = getResendEnv();

  if (!resend || !emailFrom) {
    console.warn(
      "[lev-ari] Resend not configured (RESEND_API_KEY or EMAIL_FROM missing). Email skipped.",
    );
    return { ok: false, skipped: true, reason: "Resend not configured" };
  }

  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });

  if (error) {
    console.error("[lev-ari] Resend send failed");
    return { ok: false, reason: "Email send failed" };
  }

  return { ok: true, id: data?.id };
}

/** Internal notification to site owner (CONTACT_NOTIFICATION_EMAIL) */
export async function sendLeadNotificationEmail(
  lead: LeadEmailPayload,
): Promise<EmailSendResult> {
  if (!isResendConfigured()) {
    console.warn(
      "[lev-ari] Resend not configured — internal notification skipped.",
    );
    return { ok: false, skipped: true, reason: "Resend not configured" };
  }

  if (!isNotificationEmailConfigured()) {
    console.warn(
      "[lev-ari] CONTACT_NOTIFICATION_EMAIL missing — internal notification skipped.",
    );
    return {
      ok: false,
      skipped: true,
      reason: "Notification email not configured",
    };
  }

  const { notificationEmail } = getResendEnv();
  const to = notificationEmail!.trim();
  const { subject, html, text } = buildLeadNotificationEmail(lead);

  return sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: lead.email.trim(),
  });
}

/** Confirmation email to the customer (language matches lead.language) */
export async function sendCustomerConfirmationEmail(
  lead: LeadEmailPayload,
): Promise<EmailSendResult> {
  if (!isResendConfigured()) {
    console.warn(
      "[lev-ari] Resend not configured — customer confirmation skipped.",
    );
    return { ok: false, skipped: true, reason: "Resend not configured" };
  }

  const { subject, html, text } = buildCustomerConfirmationEmail(lead);

  return sendEmail({
    to: lead.email.trim(),
    subject,
    html,
    text,
    replyTo: getResendEnv().emailFrom,
  });
}
