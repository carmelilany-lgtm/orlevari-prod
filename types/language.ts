export type Language = "en" | "he";

export function isLanguage(value: string): value is Language {
  return value === "en" || value === "he";
}
