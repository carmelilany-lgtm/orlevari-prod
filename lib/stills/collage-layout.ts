/** Collage grid spans for admin editor and public stills gallery. */

export type CollageSize = "small" | "medium" | "wide" | "tall" | "large";

export type CollageLayout = {
  w: number;
  h: number;
  size?: CollageSize;
};

export const COLLAGE_SIZE_SPANS: Record<CollageSize, CollageLayout> = {
  small: { w: 1, h: 1, size: "small" },
  medium: { w: 2, h: 2, size: "medium" },
  wide: { w: 2, h: 1, size: "wide" },
  tall: { w: 1, h: 2, size: "tall" },
  large: { w: 3, h: 2, size: "large" },
};

export const COLLAGE_SIZE_ORDER: CollageSize[] = [
  "small",
  "medium",
  "wide",
  "tall",
  "large",
];

export function layoutFromSize(size: CollageSize): CollageLayout {
  return { ...COLLAGE_SIZE_SPANS[size] };
}

export function parseCollageLayout(raw: unknown): CollageLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const w = Number(o.w);
  const h = Number(o.h);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
    return null;
  }
  const size = o.size;
  const layout: CollageLayout = {
    w: Math.min(3, Math.max(1, Math.round(w))),
    h: Math.min(2, Math.max(1, Math.round(h))),
  };
  if (
    typeof size === "string" &&
    (COLLAGE_SIZE_ORDER as string[]).includes(size)
  ) {
    layout.size = size as CollageSize;
  }
  return layout;
}

export function sizeFromLayout(layout: CollageLayout | null | undefined): CollageSize {
  if (!layout) return "small";
  if (layout.size && layout.size in COLLAGE_SIZE_SPANS) {
    return layout.size;
  }
  for (const size of COLLAGE_SIZE_ORDER) {
    const span = COLLAGE_SIZE_SPANS[size];
    if (span.w === layout.w && span.h === layout.h) return size;
  }
  if (layout.w >= 3) return "large";
  if (layout.w >= 2 && layout.h >= 2) return "medium";
  if (layout.w >= 2) return "wide";
  if (layout.h >= 2) return "tall";
  return "small";
}

export function hasCustomCollageLayout(
  items: { collage_layout?: CollageLayout | null }[],
): boolean {
  return items.some((item) => item.collage_layout != null);
}

/** Tablet: cap spans so the grid stays balanced. */
export function collageSpansForViewport(
  layout: CollageLayout | null | undefined,
  viewport: "desktop" | "tablet" | "mobile",
): { col: number; row: number } {
  if (!layout || viewport === "mobile") {
    return { col: 1, row: 1 };
  }
  let col = layout.w;
  let row = layout.h;
  if (viewport === "tablet") {
    col = Math.min(col, 2);
    row = Math.min(row, 2);
  }
  return { col: Math.max(1, col), row: Math.max(1, row) };
}
