const STILLS_MOBILE_COLUMNS = 2;
export const STILLS_MOBILE_INITIAL = 2;
/** Desktop shows a larger first batch than the phone (2). */
export const STILLS_DESKTOP_INITIAL = 8;
/** Clicks needed after the first screen to reveal every photo. */
export const STILLS_LOAD_MORE_CLICKS = 2;

export function stillsGalleryPaging(
  total: number,
  initial: number,
  options?: { columnAlign?: number },
): { initial: number; step: number } {
  if (total <= 0) return { initial: 0, step: 0 };
  const start = Math.min(Math.max(initial, 1), total);
  if (total <= start) {
    return { initial: total, step: 0 };
  }

  const remaining = total - start;
  let step = Math.ceil(remaining / STILLS_LOAD_MORE_CLICKS);
  const align = options?.columnAlign;

  if (align && align > 1 && remaining > align) {
    if (step % align !== 0) {
      step += align - (step % align);
    }
    if (step >= remaining) {
      step = remaining - align;
      if (step % align !== 0) {
        step = Math.max(align, step - (step % align));
      }
    }
  }

  step = Math.min(Math.max(step, 1), remaining);
  return { initial: start, step };
}

/**
 * Mobile stills are a 2-column grid. First screen is one row; the rest
 * is split so two “show more” clicks reveal everything.
 */
export function stillsMobilePaging(total: number): {
  initial: number;
  step: number;
} {
  return stillsGalleryPaging(total, STILLS_MOBILE_INITIAL, {
    columnAlign: STILLS_MOBILE_COLUMNS,
  });
}

export function stillsDesktopPaging(total: number): {
  initial: number;
  step: number;
} {
  return stillsGalleryPaging(total, STILLS_DESKTOP_INITIAL);
}
