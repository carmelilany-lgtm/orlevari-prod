import type { StillWorkItem } from "@/types/works";

const HERO_CELL_COUNT = 6;

function publishedWithUrl(stills: StillWorkItem[]): StillWorkItem[] {
  return stills.filter(
    (s) => s.published !== false && Boolean(s.image_url?.trim()),
  );
}

/**
 * Hero collage sources: marked hero stills first, else all published stills.
 * Returns up to `count` items, cycling when fewer than needed.
 */
export function pickHeroStillImages(
  stills: StillWorkItem[],
  count = HERO_CELL_COUNT,
): StillWorkItem[] {
  const published = publishedWithUrl(stills);
  if (published.length === 0) return [];

  const heroMarked = published.filter((s) => s.show_in_hero);
  const source = heroMarked.length > 0 ? heroMarked : published;

  const result: StillWorkItem[] = [];
  for (let i = 0; i < count; i++) {
    result.push(source[i % source.length]);
  }
  return result;
}
