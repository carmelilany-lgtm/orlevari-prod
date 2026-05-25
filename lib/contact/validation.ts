import { LEAD_MESSAGE_MAX_LENGTH } from "@/types/leads";
import type { ContactValidationMessages } from "@/lib/contact/validation-messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFieldKey =
  | "full_name"
  | "phone"
  | "email"
  | "service_type"
  | "privacy_accepted"
  | "message";

export type ContactFieldErrors = Partial<Record<ContactFieldKey, string>>;

export interface ContactFormValues {
  full_name: string;
  phone: string;
  email: string;
  service_type: string;
  message: string;
  privacy_accepted: boolean;
}

export function stripPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const digits = stripPhoneDigits(phone);
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function validateContactFields(
  values: ContactFormValues,
  messages: ContactValidationMessages,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const fullName = values.full_name.trim();
  if (!fullName) {
    errors.full_name = messages.fullNameRequired;
  } else if (fullName.length < 2) {
    errors.full_name = messages.fullNameTooShort;
  }

  const phone = values.phone.trim();
  if (!phone) {
    errors.phone = messages.phoneRequired;
  } else if (!isValidPhone(phone)) {
    errors.phone = messages.phoneInvalid;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = messages.emailRequired;
  } else if (!isValidEmail(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.service_type.trim()) {
    errors.service_type = messages.serviceTypeRequired;
  }

  if (values.privacy_accepted !== true) {
    errors.privacy_accepted = messages.privacyRequired;
  }

  const message = values.message.trim();
  if (message.length > LEAD_MESSAGE_MAX_LENGTH) {
    errors.message = messages.messageTooLong;
  }

  return errors;
}

export type ClientContactFieldKey =
  | "fullName"
  | "phone"
  | "email"
  | "serviceType"
  | "message"
  | "privacyAccepted";

/** Map API snake_case keys to client camelCase field keys */
export const API_TO_CLIENT_FIELD: Record<ContactFieldKey, ClientContactFieldKey> =
  {
    full_name: "fullName",
    phone: "phone",
    email: "email",
    service_type: "serviceType",
    message: "message",
    privacy_accepted: "privacyAccepted",
  };

export function mapApiErrorsToClient(
  apiErrors: Record<string, string>,
): Partial<Record<ClientContactFieldKey, string>> {
  const mapped: Partial<Record<ClientContactFieldKey, string>> = {};

  for (const [key, message] of Object.entries(apiErrors)) {
    const clientKey = API_TO_CLIENT_FIELD[key as ContactFieldKey];
    if (clientKey && message) {
      mapped[clientKey] = message;
    }
  }

  return mapped;
}
