export const ABOUT_TITLE_SIZES = ["sm", "md", "lg", "xl"] as const;

export type AboutTitleSize = (typeof ABOUT_TITLE_SIZES)[number];

export const DEFAULT_ABOUT_TITLE_SIZE: AboutTitleSize = "md";

export const ABOUT_TITLE_SIZE_CLASSES: Record<AboutTitleSize, string> = {
  sm: "text-xl sm:text-2xl lg:text-3xl",
  md: "text-2xl sm:text-3xl lg:text-4xl",
  lg: "text-3xl sm:text-4xl lg:text-5xl",
  xl: "text-4xl sm:text-5xl lg:text-[3.25rem]",
};

export const ABOUT_TITLE_SIZE_LABELS: Record<AboutTitleSize, string> = {
  sm: "קטן",
  md: "בינוני",
  lg: "גדול",
  xl: "גדול מאוד",
};

export function parseAboutTitleSize(value: string | null | undefined): AboutTitleSize {
  const trimmed = value?.trim().toLowerCase();
  if (trimmed && ABOUT_TITLE_SIZES.includes(trimmed as AboutTitleSize)) {
    return trimmed as AboutTitleSize;
  }
  return DEFAULT_ABOUT_TITLE_SIZE;
}
