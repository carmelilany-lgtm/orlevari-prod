import { VISUAL_CONTENT_KEYS, type VisualContentKey } from "@/lib/admin/visual-content-keys";
import type { CSSProperties } from "react";

export const VISUAL_FIELD_STYLES_CONTENT_KEY = "visual_field_styles" as const;

export type VisualFieldStyle = {
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
};

export type VisualFieldStylesMap = Partial<Record<VisualContentKey, VisualFieldStyle>>;

export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 72;
export const FONT_SIZE_STEP = 2;

export const FONT_SIZE_PRESETS = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64,
] as const;

export const DEFAULT_FIELD_FONT_SIZE: Record<VisualContentKey, number> = {
  hero_title: 36,
  hero_subtitle: 32,
  hero_primary_button: 16,
  hero_secondary_button: 16,
  about_extended_title: 32,
  about_extended_text: 18,
  about_extended_quote: 16,
  works_title: 36,
  services_title: 36,
  contact_title: 36,
  contact_intro: 18,
};

export function clampFontSize(value: number): number {
  if (!Number.isFinite(value)) return FONT_SIZE_MIN;
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(value)));
}

export function parseVisualFieldStyles(
  raw: string | null | undefined,
): VisualFieldStylesMap {
  if (!raw?.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const source = parsed as Record<string, unknown>;
    const out: VisualFieldStylesMap = {};
    for (const key of VISUAL_CONTENT_KEYS) {
      const row = source[key];
      if (!row || typeof row !== "object") continue;
      const item = row as Record<string, unknown>;
      const style: VisualFieldStyle = {};
      if (typeof item.fontSize === "number") {
        style.fontSize = clampFontSize(item.fontSize);
      }
      if (item.bold === true) style.bold = true;
      if (item.italic === true) style.italic = true;
      if (style.fontSize !== undefined || style.bold || style.italic) {
        out[key] = style;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function stringifyVisualFieldStyles(map: VisualFieldStylesMap): string {
  const clean: Record<string, VisualFieldStyle> = {};
  for (const key of VISUAL_CONTENT_KEYS) {
    const style = map[key];
    if (!style) continue;
    const next: VisualFieldStyle = {};
    if (style.fontSize !== undefined) next.fontSize = clampFontSize(style.fontSize);
    if (style.bold) next.bold = true;
    if (style.italic) next.italic = true;
    if (Object.keys(next).length > 0) clean[key] = next;
  }
  return JSON.stringify(clean);
}

export function visualFieldStyleToCss(
  style: VisualFieldStyle | undefined,
): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.fontSize) {
    css.fontSize = `${style.fontSize}px`;
    css.lineHeight = 1.25;
  }
  if (style.bold) css.fontWeight = 700;
  if (style.italic) css.fontStyle = "italic";
  return css;
}

export function effectiveFontSize(
  key: VisualContentKey,
  style: VisualFieldStyle | undefined,
): number {
  return style?.fontSize ?? DEFAULT_FIELD_FONT_SIZE[key];
}

export function hasVisualFieldStyle(style: VisualFieldStyle | undefined): boolean {
  return Boolean(style && (style.fontSize || style.bold || style.italic));
}

export function stylesMapsEqual(
  a: VisualFieldStylesMap,
  b: VisualFieldStylesMap,
): boolean {
  return stringifyVisualFieldStyles(a) === stringifyVisualFieldStyles(b);
}
