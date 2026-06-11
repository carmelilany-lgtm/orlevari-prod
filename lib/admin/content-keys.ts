import type { SiteContentKey } from "@/types/content";

export const SITE_CONTENT_SECTIONS: {
  title: string;
  keys: SiteContentKey[];
}[] = [
  {
    title: "Hero",
    keys: [
      "hero_title",
      "hero_subtitle",
      "hero_primary_button",
      "hero_secondary_button",
    ],
  },
  {
    title: "About",
    keys: [
      "about_title",
      "about_intro",
      "about_text",
      "about_extended_title",
      "about_extended_text",
      "about_extended_quote",
    ],
  },
  {
    title: "Works",
    keys: ["works_title"],
  },
  {
    title: "Services",
    keys: ["services_title"],
  },
  {
    title: "Contact",
    keys: [
      "contact_title",
      "contact_intro",
      "phone",
      "email",
      "whatsapp_number",
      "whatsapp_message_en",
      "whatsapp_message_he",
      "whatsapp_enabled",
      "whatsapp_floating_enabled",
    ],
  },
  {
    title: "SEO",
    keys: [
      "seo_title_en",
      "seo_title_he",
      "seo_description_en",
      "seo_description_he",
    ],
  },
];

/** Hebrew admin labels for CMS keys */
export const CONTENT_KEY_LABELS: Partial<Record<SiteContentKey, string>> = {
  about_intro: "תקציר אודות קצר",
  about_extended_title: "כותרת אודות מורחבת",
  about_extended_text: "טקסט אודות מורחב",
  about_extended_quote: "ציטוט / משפט מסכם באודות",
  about_extended_image_url: "תמונת אודות מורחבת",
};

const LONG_TEXT_KEYS = new Set<SiteContentKey>([
  "hero_subtitle",
  "about_text",
  "about_intro",
  "about_extended_text",
  "contact_intro",
  "whatsapp_message_en",
  "whatsapp_message_he",
  "seo_description_en",
  "seo_description_he",
]);

export function isLongContentKey(key: SiteContentKey): boolean {
  return LONG_TEXT_KEYS.has(key);
}

export function contentKeyLabel(key: SiteContentKey): string {
  return CONTENT_KEY_LABELS[key] ?? key;
}
