import type { Locale } from "@/types/i18n";

const messages = {
  he: {
    invalidType: "סוג הקובץ לא נתמך",
    tooLarge: "הקובץ גדול מדי",
    uploadFailed: "העלאת התמונה נכשלה",
    dimensionsUnreadable:
      "לא ניתן לקרוא את התמונה, אבל ננסה להעלות אותה ללא ממדים.",
    maxFiles: (max: number) => `ניתן להעלות עד ${max} תמונות בכל פעם.`,
    addToGallery: "הוספת תמונות לגלריה",
    chooseImages: "בחר תמונות",
    uploading: "מעלה...",
    uploadingProgress: (current: number, total: number) =>
      `מעלה ${current} מתוך ${total}`,
    addedSuccess: "התמונות נוספו בהצלחה",
    uploadSummary: (ok: number, total: number) =>
      `הועלו ${ok} מתוך ${total} תמונות`,
    changeAboutImage: "החלפת תמונה",
    aboutSaved: "התמונה עודכנה ונשמרה",
    aboutUploadFailed: "העלאת תמונת האודות נכשלה",
  },
  en: {
    invalidType: "Unsupported file type",
    tooLarge: "File is too large",
    uploadFailed: "Image upload failed",
    dimensionsUnreadable:
      "Couldn't read image dimensions, but we will try uploading without dimensions.",
    maxFiles: (max: number) => `You can upload up to ${max} images at a time.`,
    addToGallery: "Add images to gallery",
    chooseImages: "Choose images",
    uploading: "Uploading...",
    uploadingProgress: (current: number, total: number) =>
      `Uploading ${current} of ${total}`,
    addedSuccess: "Images added successfully",
    uploadSummary: (ok: number, total: number) =>
      `Uploaded ${ok} of ${total} images`,
    changeAboutImage: "Change image",
    aboutSaved: "Image updated and saved",
    aboutUploadFailed: "About image upload failed",
  },
} as const;

export function visualUploadMessages(locale: Locale) {
  return messages[locale];
}
