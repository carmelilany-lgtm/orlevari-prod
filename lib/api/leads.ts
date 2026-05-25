import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  LEAD_MESSAGE_MAX_LENGTH,
  type CreateLeadInput,
} from "@/types/leads";
import { isLanguage } from "@/types/language";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LeadValidationResult {
  ok: boolean;
  errors?: Record<string, string>;
}

export function validateLeadInput(input: CreateLeadInput): LeadValidationResult {
  const errors: Record<string, string> = {};

  if (!input.full_name?.trim()) {
    errors.full_name = "Full name is required";
  }
  if (!input.phone?.trim()) {
    errors.phone = "Phone is required";
  }
  if (!input.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Invalid email format";
  }
  if (input.privacy_accepted !== true) {
    errors.privacy_accepted = "Privacy policy must be accepted";
  }
  if (!isLanguage(input.language)) {
    errors.language = "Language must be en or he";
  }
  if (input.message && input.message.trim().length > LEAD_MESSAGE_MAX_LENGTH) {
    errors.message = `Message must be at most ${LEAD_MESSAGE_MAX_LENGTH} characters`;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

export async function createLead(
  input: CreateLeadInput,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const validation = validateLeadInput(input);
  if (!validation.ok) {
    return { ok: false, error: "Validation failed" };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Contact form is not configured" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Contact form is not configured" };
  }

  // Do not .select() after insert — anon has INSERT only on leads (no SELECT).
  const { error } = await supabase.from("leads").insert({
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    service_type: input.service_type?.trim() || null,
    message: input.message?.trim() || null,
    language: input.language,
    privacy_accepted: true,
  });

  if (error) {
    console.error("[lev-ari] createLead:", error.message);
    return { ok: false, error: "Could not save your message" };
  }

  return { ok: true };
}
