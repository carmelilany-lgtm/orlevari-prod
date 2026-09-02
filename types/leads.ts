import type { Language } from "@/types/language";

export const LEAD_MESSAGE_MAX_LENGTH = 2000;

/** DB row - leads */
export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  service_type: string | null;
  message: string | null;
  language: Language;
  privacy_accepted: boolean;
  created_at: string;
}

export interface CreateLeadInput {
  full_name: string;
  phone: string;
  email: string;
  service_type: string;
  message?: string;
  language: Language;
  privacy_accepted: boolean;
}
