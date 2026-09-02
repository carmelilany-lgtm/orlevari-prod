import type { StillWorkItem } from "@/types/works";

const HERO_CELL_COUNT = 6;

function publishedWithUrl(stills: StillWorkItem[]): StillWorkItem[] {
  return stills.filter(
    (s) => s.published !== false && Boolean(s.image_url?.trim()),
  );
}

/** Published stills eligible for the hero random pool. */
export function getEligibleHeroStills(stills: StillWorkItem[]): StillWorkItem[] {
  return publishedWithUrl(stills).filter((s) => s.exclude_from_hero !== true);
}

/**
 * Deterministic hero order (sort_order) - used for SSR and first client paint
 * so server and client markup match before shuffle.
 */
export function pickHeroStillImagesForRender(
  stills: StillWorkItem[],
  count = HERO_CELL_COUNT,
): StillWorkItem[] {
  const eligible = getEligibleHeroStills(stills);
  if (eligible.length === 0) return [];

  const sorted = [...eligible].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  const result: StillWorkItem[] = [];
  for (let i = 0; i < count; i++) {
    result.push(sorted[i % sorted.length]);
  }
  return result;
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Random hero order. Run on the server (homepage) and pass the result into
 * the client Hero so the first paint matches hydration — shuffling after
 * mount wasted the LCP preload and made the large tile load last.
 */
export function pickHeroStillImagesRandom(
  stills: StillWorkItem[],
  count = HERO_CELL_COUNT,
): StillWorkItem[] {
  const eligible = getEligibleHeroStills(stills);
  if (eligible.length === 0) return [];

  const pool = [...eligible];
  shuffleInPlace(pool);
  const result: StillWorkItem[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}

/** @deprecated Use pickHeroStillImagesForRender - kept for tests importing old name */
export function pickHeroStillImages(
  stills: StillWorkItem[],
  count = HERO_CELL_COUNT,
): StillWorkItem[] {
  return pickHeroStillImagesForRender(stills, count);
}
