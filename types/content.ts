/** DB row — site_content */
export interface SiteContentItem {
  id: string;
  key: string;
  value_en: string | null;
  value_he: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SiteContentKey =
  | "hero_title"
  | "hero_subtitle"
  | "hero_primary_button"
  | "hero_secondary_button"
  | "about_title"
  | "about_text"
  | "works_title"
  | "services_title"
  | "contact_title"
  | "contact_intro"
  | "phone"
  | "email"
  | "whatsapp_number"
  | "whatsapp_message_en"
  | "whatsapp_message_he"
  | "whatsapp_enabled"
  | "whatsapp_floating_enabled"
  | "seo_title_en"
  | "seo_title_he"
  | "seo_description_en"
  | "seo_description_he";

export type SiteContentMap = Partial<Record<SiteContentKey, SiteContentItem>>;
