export const STILLS_MOBILE_INITIAL = 2;
/** Desktop shows a larger first batch than the phone (2). */
export const STILLS_DESKTOP_INITIAL = 12;

export function stillsGalleryPaging(
  total: number,
  initial: number,
): { initial: number; step: number } {
  if (total <= 0) return { initial: 0, step: 0 };
  const start = Math.min(Math.max(initial, 1), total);
  if (total <= start) {
    return { initial: total, step: 0 };
  }

  return { initial: start, step: total - start };
}

/**
 * Mobile stills are a 2-column grid. First screen is one row; one
 * “show more” click reveals every remaining published photo.
 */
export function stillsMobilePaging(total: number): {
  initial: number;
  step: number;
} {
  return stillsGalleryPaging(total, STILLS_MOBILE_INITIAL);
}

export function stillsDesktopPaging(total: number): {
  initial: number;
  step: number;
} {
  return stillsGalleryPaging(total, STILLS_DESKTOP_INITIAL);
}
