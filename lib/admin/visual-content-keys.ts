import type { SiteContentKey } from "@/types/content";

/** Keys editable from the public homepage visual editor (allow-list). */
export const VISUAL_CONTENT_KEYS = [
  "hero_title",
  "hero_subtitle",
  "hero_primary_button",
  "hero_secondary_button",
  "about_extended_title",
  "about_extended_text",
  "about_extended_quote",
  "works_title",
  "services_title",
  "contact_title",
  "contact_intro",
] as const satisfies readonly SiteContentKey[];

export type VisualContentKey = (typeof VISUAL_CONTENT_KEYS)[number];

const VISUAL_KEY_SET = new Set<string>(VISUAL_CONTENT_KEYS);

export function isVisualContentKey(key: string): key is VisualContentKey {
  return VISUAL_KEY_SET.has(key);
}

/** Multiline fields in the visual editor */
export const VISUAL_MULTILINE_KEYS = new Set<VisualContentKey>([
  "hero_subtitle",
  "about_extended_text",
  "contact_intro",
]);

export function isVisualMultilineKey(key: VisualContentKey): boolean {
  return VISUAL_MULTILINE_KEYS.has(key);
}

/** Hebrew friendly labels for edit-mode hints */
export const VISUAL_FIELD_LABELS: Record<VisualContentKey, string> = {
  hero_title: "כותרת ראשית",
  hero_subtitle: "משפט פתיחה",
  hero_primary_button: "כפתור ראשי",
  hero_secondary_button: "כפתור משני",
  about_extended_title: "כותרת אודות",
  about_extended_text: "טקסט אודות",
  about_extended_quote: "ציטוט / משפט מסכם באודות",
  works_title: "כותרת עבודות",
  services_title: "כותרת שירותים",
  contact_title: "כותרת צור קשר",
  contact_intro: "טקסט צור קשר",
};
