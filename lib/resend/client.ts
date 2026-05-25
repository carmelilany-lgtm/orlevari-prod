import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Server-only Resend client. Returns null when RESEND_API_KEY is missing.
 * Never import from Client Components.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  if (!client) {
    client = new Resend(apiKey);
  }

  return client;
}
