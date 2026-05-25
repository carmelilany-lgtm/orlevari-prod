import { getContactValidationMessages } from "@/lib/contact/validation-messages";
import {
  isValidEmail,
  isValidPhone,
  type ContactFieldErrors,
} from "@/lib/contact/validation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  LEAD_MESSAGE_MAX_LENGTH,
  type CreateLeadInput,
} from "@/types/leads";
export interface LeadValidationResult {
  ok: boolean;
  errors?: ContactFieldErrors;
}

export function validateLeadInput(input: CreateLeadInput): LeadValidationResult {
  const messages = getContactValidationMessages(input.language);
  const errors: ContactFieldErrors = {};

  const fullName = input.full_name?.trim() ?? "";
  if (!fullName) {
    errors.full_name = messages.fullNameRequired;
  } else if (fullName.length < 2) {
    errors.full_name = messages.fullNameTooShort;
  }

  const phone = input.phone?.trim() ?? "";
  if (!phone) {
    errors.phone = messages.phoneRequired;
  } else if (!isValidPhone(phone)) {
    errors.phone = messages.phoneInvalid;
  }

  const email = input.email?.trim() ?? "";
  if (!email) {
    errors.email = messages.emailRequired;
  } else if (!isValidEmail(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!input.service_type?.trim()) {
    errors.service_type = messages.serviceTypeRequired;
  }

  if (input.privacy_accepted !== true) {
    errors.privacy_accepted = messages.privacyRequired;
  }

  const message = input.message?.trim() ?? "";
  if (message.length > LEAD_MESSAGE_MAX_LENGTH) {
    errors.message = messages.messageTooLong;
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
