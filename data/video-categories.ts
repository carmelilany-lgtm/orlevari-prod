import type { VideoCategoryId } from "@/types/works";

export interface VideoCategory {
  id: VideoCategoryId;
  label: { en: string; he: string };
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  { id: "corporate", label: { en: "Corporate Films", he: "סרטי תדמית" } },
  { id: "events", label: { en: "Events", he: "אירועים" } },
  { id: "family", label: { en: "Family Films", he: "סרטי משפחה" } },
  { id: "music-shows", label: { en: "Music & Shows", he: "הופעות ומוזיקה" } },
  { id: "documentary", label: { en: "Documentary", he: "דוקומנטרי" } },
  { id: "short-films", label: { en: "Short Films", he: "סרטים קצרים" } },
  { id: "news", label: { en: "News & Reports", he: "כתבות וחדשות" } },
  {
    id: "haam-im-hagolan",
    label: { en: "Ha'am Im HaGolan", he: "העם עם הגולן" },
  },
  { id: "cooking", label: { en: "Cooking Shows", he: "תוכניות בישול" } },
];
