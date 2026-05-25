import { VIDEO_CATEGORIES } from "@/data/video-categories";
import {
  STILLS_MOCK_COUNT,
  VIDEO_CATEGORY_MOCK_COUNT,
} from "@/data/works-display-config";
import type { StillWorkItem, VideoWorkItem } from "@/types/works";

const STILL_ALTS_EN = [
  "Portrait in soft window light",
  "Candid event moment",
  "Studio still life",
  "Behind the scenes on set",
  "Concert stage frame",
  "Family session embrace",
  "Urban night street",
  "Documentary field frame",
  "Stage performance glow",
  "Wedding detail close-up",
  "Corporate portrait",
  "Field report silhouette",
  "Chef kitchen atmosphere",
  "Golan landscape vista",
  "Music rehearsal room",
  "Short film dramatic still",
  "News desk setup",
  "Cooking close-up steam",
  "Family embrace golden hour",
  "Gala evening sparkle",
  "Live performance crowd",
  "Interview two-shot",
  "Cinematic wide landscape",
  "Intimate close-up eyes",
  "Backstage mirror moment",
  "Rehearsal hallway light",
  "Crowd hands raised",
  "Chef plating detail",
  "Sunset ridge panorama",
  "Drummer mid-strike",
  "Newsroom monitors glow",
  "Dance floor motion blur",
  "Reception table candles",
  "Mountain fog morning",
  "Violinist close-up",
  "Street market color",
  "Theater curtain rise",
  "Ocean cliff wide shot",
  "Boxing gym shadows",
  "Editorial fashion frame",
];

const STILL_ALTS_HE = [
  "פורטרט באור חלון רך",
  "רגע אמיתי באירוע",
  "סטילס חיים בסטודיו",
  "מאחורי הקלעים על הסט",
  "פריים במה בהופעה",
  "חיבוק בסשן משפחה",
  "רחוב בלילה עירוני",
  "פריים דוקו בשטח",
  "זוהר הופעה חיה",
  "תקריב פרטי חתונה",
  "פורטרט תדמית",
  "צללית כתבת שטח",
  "אווירה במטבח שף",
  "נוף פנורמה בגולן",
  "חדר חזרות מוזיקה",
  "סטילס דרמטי מסרט קצר",
  "הכנת שולחן חדשות",
  "תקריב בישול עם קיטור",
  "חיבוק משפחתי בשעה זהובה",
  "נצנוץ ערב גאלה",
  "קהל בהופעה חיה",
  "שוט ראיון לשניים",
  "נוף רחב קולנועי",
  "תקריב אינטימי לעיניים",
  "רגע מול מראה בקוליסים",
  "אור במסדרון חזרות",
  "ידיים מורמות בקהל",
  "פרטי הגשה במטבח",
  "פנורמת שקיעה על גבעות",
  "מכה בתוף באמצע",
  "זוהר מסכי חדר חדשות",
  "תנועה מטושטשת על רחבת ריקודים",
  "נרות על שולחן אירוע",
  "בוקר עם ערפל בהרים",
  "תקריב כנר",
  "צבע בשוק רחוב",
  "הרמת מסך בתיאטרון",
  "נוף רחב מצוק לים",
  "צללים באולם איגרוף",
  "פריים אופנה עריכתי",
];

/** Realistic intrinsic sizes — layout follows width/height, not manual spans */
const STILL_MOCK_DIMENSIONS: { width: number; height: number }[] = [
  { width: 1080, height: 1620 },
  { width: 800, height: 520 },
  { width: 1920, height: 1080 },
  { width: 2400, height: 960 },
  { width: 900, height: 1600 },
  { width: 1200, height: 1200 },
  { width: 3200, height: 720 },
  { width: 1600, height: 1067 },
  { width: 1080, height: 1440 },
  { width: 1400, height: 1750 },
  { width: 720, height: 480 },
  { width: 2560, height: 1024 },
  { width: 960, height: 1280 },
  { width: 1200, height: 1200 },
  { width: 1920, height: 1280 },
  { width: 1080, height: 1620 },
  { width: 3600, height: 900 },
  { width: 640, height: 800 },
  { width: 1500, height: 2000 },
  { width: 1080, height: 1350 },
  { width: 2048, height: 1152 },
  { width: 900, height: 600 },
  { width: 800, height: 1400 },
  { width: 1000, height: 1000 },
  { width: 600, height: 900 },
  { width: 1080, height: 1440 },
  { width: 2800, height: 1050 },
  { width: 1920, height: 1080 },
  { width: 4000, height: 1000 },
  { width: 960, height: 1440 },
  { width: 1200, height: 1200 },
  { width: 1280, height: 1920 },
  { width: 1100, height: 733 },
  { width: 3600, height: 1200 },
  { width: 700, height: 1050 },
  { width: 1600, height: 1200 },
  { width: 900, height: 1350 },
  { width: 3200, height: 800 },
  { width: 1000, height: 1500 },
  { width: 840, height: 1260 },
];

const VIDEO_TITLE_SUFFIXES: { en: string; he: string }[] = [
  { en: "Highlight Reel", he: "סרט היילייט" },
  { en: "Full Feature", he: "סרט מלא" },
  { en: "Teaser", he: "טיזר" },
  { en: "Director's Cut", he: "גירסת במאי" },
  { en: "Episode I", he: "פרק א׳" },
  { en: "Special Edition", he: "מהדורה מיוחדת" },
];

/** Replace with Supabase query: select * from video_works order by category, sort_order */
export const MOCK_VIDEO_WORKS: VideoWorkItem[] = VIDEO_CATEGORIES.flatMap(
  (category) =>
    Array.from({ length: VIDEO_CATEGORY_MOCK_COUNT }, (_, index) => {
      const suffix = VIDEO_TITLE_SUFFIXES[index];
      return {
        id: `v-${category.id}-${index + 1}`,
        categoryId: category.id,
        title: {
          en: `${category.label.en} — ${suffix.en}`,
          he: `${category.label.he} — ${suffix.he}`,
        },
        thumbnailLabel: `${category.label.en} ${index + 1}`,
      };
    }),
);

/** Replace with Supabase: still_works where published order by sort_order */
export const MOCK_STILLS: StillWorkItem[] = Array.from(
  { length: STILLS_MOCK_COUNT },
  (_, index) => {
    const { width, height } =
      STILL_MOCK_DIMENSIONS[index % STILL_MOCK_DIMENSIONS.length];
    return {
      id: `s${index + 1}`,
      alt_en: STILL_ALTS_EN[index] ?? `Still ${index + 1}`,
      alt_he: STILL_ALTS_HE[index] ?? `סטילס ${index + 1}`,
      width,
      height,
      aspect_ratio: width / height,
      variant: index % 12,
      sort_order: index + 1,
      published: true,
    };
  },
);
