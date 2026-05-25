/** DB row — services */
export interface Service {
  id: string;
  title_en: string;
  title_he: string;
  description_en: string | null;
  description_he: string | null;
  icon_key: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

/** UI-friendly service card */
export interface ServiceDisplay {
  id: string;
  title: { en: string; he: string };
  description: { en: string; he: string };
  iconKey?: string;
}
