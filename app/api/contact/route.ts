import { createLead, validateLeadInput } from "@/lib/api/leads";
import {
  sendCustomerConfirmationEmail,
  sendLeadNotificationEmail,
  type LeadEmailPayload,
} from "@/lib/resend/emails";
import type { CreateLeadInput } from "@/types/leads";
import { isLanguage } from "@/types/language";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ContactBody {
  full_name?: string;
  phone?: string;
  email?: string;
  service_type?: string;
  message?: string;
  language?: string;
  privacy_accepted?: boolean;
  /** Honeypot — bots only; must stay empty */
  company_website?: string;
}

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function toLeadInput(body: ContactBody): CreateLeadInput | null {
  const language = body.language ?? "en";
  if (!isLanguage(language)) {
    return null;
  }

  return {
    full_name: body.full_name?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    email: body.email?.trim() ?? "",
    service_type: trimOptional(body.service_type),
    message: trimOptional(body.message),
    language,
    privacy_accepted: body.privacy_accepted === true,
  };
}

function toEmailPayload(input: CreateLeadInput): LeadEmailPayload {
  return {
    full_name: input.full_name,
    phone: input.phone,
    email: input.email,
    service_type: input.service_type?.trim() || null,
    message: input.message?.trim() || null,
    language: input.language,
    created_at: new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    console.warn("[lev-ari] contact: invalid JSON body");
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  // Honeypot: silently accept without saving or emailing
  if (body.company_website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const input = toLeadInput(body);
  if (!input) {
    console.warn("[lev-ari] contact: invalid language or payload");
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const validation = validateLeadInput(input);
  if (!validation.ok) {
    console.warn("[lev-ari] contact: validation failed");
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again" },
      { status: 400 },
    );
  }

  const result = await createLead(input);

  if (!result.ok) {
    console.error("[lev-ari] contact: lead insert failed");
    return NextResponse.json(
      { ok: false, error: "Unable to submit right now. Please try again later." },
      { status: 503 },
    );
  }

  const emailPayload = toEmailPayload(input);

  const notificationResult = await sendLeadNotificationEmail(emailPayload);
  if (!notificationResult.ok && !notificationResult.skipped) {
    console.error(
      "[lev-ari] contact: internal notification email failed",
      notificationResult.reason,
    );
  } else if (!notificationResult.ok && notificationResult.skipped) {
    console.warn(
      "[lev-ari] contact: internal notification skipped —",
      notificationResult.reason,
    );
  }

  const confirmationResult = await sendCustomerConfirmationEmail(emailPayload);
  if (!confirmationResult.ok && !confirmationResult.skipped) {
    console.error(
      "[lev-ari] contact: customer confirmation email failed",
      confirmationResult.reason,
    );
  } else if (!confirmationResult.ok && confirmationResult.skipped) {
    console.warn(
      "[lev-ari] contact: customer confirmation skipped —",
      confirmationResult.reason,
    );
  }

  // TODO: rate limiting on /api/contact
  // TODO: Turnstile or reCAPTCHA if spam becomes a problem

  return NextResponse.json({
    ok: true,
    message: "Your message was received.",
  });
}
