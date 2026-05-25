/** Collage grid spans for admin editor and public stills gallery. */

export type CollageSize = "small" | "medium" | "wide" | "tall" | "large";

export type CollageLayout = {
  x?: number;
  y?: number;
  w: number;
  h: number;
  size?: CollageSize;
};

export const COLLAGE_GRID_COLS = 12;

export const COLLAGE_SIZE_SPANS: Record<CollageSize, CollageLayout> = {
  small: { w: 1, h: 1, size: "small" },
  medium: { w: 2, h: 2, size: "medium" },
  wide: { w: 3, h: 2, size: "wide" },
  tall: { w: 2, h: 3, size: "tall" },
  large: { w: 4, h: 3, size: "large" },
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
  const layout: CollageLayout = {
    w: Math.min(COLLAGE_GRID_COLS, Math.max(1, Math.round(w))),
    h: Math.min(8, Math.max(1, Math.round(h))),
  };
  const x = Number(o.x);
  const y = Number(o.y);
  if (Number.isFinite(x) && x >= 0) {
    layout.x = Math.min(COLLAGE_GRID_COLS - 1, Math.round(x));
  }
  if (Number.isFinite(y) && y >= 0) {
    layout.y = Math.max(0, Math.round(y));
  }
  const size = o.size;
  if (
    typeof size === "string" &&
    (COLLAGE_SIZE_ORDER as string[]).includes(size)
  ) {
    layout.size = size as CollageSize;
  }
  return layout;
}

export function hasPositionalCollageLayout(
  items: { collage_layout?: CollageLayout | null }[],
): boolean {
  return items.some((item) => {
    const layout = item.collage_layout;
    return (
      layout != null &&
      Number.isFinite(layout.x) &&
      Number.isFinite(layout.y)
    );
  });
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

export function clampCollageLayoutItem(input: {
  x: number;
  y: number;
  w: number;
  h: number;
}): CollageLayout {
  const w = Math.min(COLLAGE_GRID_COLS, Math.max(1, Math.round(input.w)));
  const x = Math.min(COLLAGE_GRID_COLS - w, Math.max(0, Math.round(input.x)));
  const y = Math.max(0, Math.round(input.y));
  const h = Math.min(8, Math.max(1, Math.round(input.h)));
  return { x, y, w, h };
}

/** Build default x/y positions for react-grid-layout from span-only layouts. */
export function buildDefaultGridPositions(
  items: { id: string; collage_layout?: CollageLayout | null }[],
): Map<string, CollageLayout> {
  const result = new Map<string, CollageLayout>();
  let cursorX = 0;
  let cursorY = 0;
  let rowMaxH = 1;

  for (const item of items) {
    const parsed = parseCollageLayout(item.collage_layout);
    const w = parsed?.w ?? 2;
    const h = parsed?.h ?? 2;
    if (
      parsed &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      result.set(item.id, clampCollageLayoutItem({
        x: parsed.x!,
        y: parsed.y!,
        w,
        h,
      }));
      continue;
    }
    if (cursorX + w > COLLAGE_GRID_COLS) {
      cursorX = 0;
      cursorY += rowMaxH;
      rowMaxH = 1;
    }
    result.set(
      item.id,
      clampCollageLayoutItem({ x: cursorX, y: cursorY, w, h }),
    );
    cursorX += w;
    rowMaxH = Math.max(rowMaxH, h);
  }

  return result;
}
