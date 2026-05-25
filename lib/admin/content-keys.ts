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
    keys: ["about_title", "about_text"],
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

const LONG_TEXT_KEYS = new Set<SiteContentKey>([
  "hero_subtitle",
  "about_text",
  "contact_intro",
  "whatsapp_message_en",
  "whatsapp_message_he",
  "seo_description_en",
  "seo_description_he",
]);

export function isLongContentKey(key: SiteContentKey): boolean {
  return LONG_TEXT_KEYS.has(key);
}

export function formatContentKeyLabel(key: string): string {
  return key.replace(/_/g, " ");
}
