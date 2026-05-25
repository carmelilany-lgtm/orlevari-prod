/** Client-safe YouTube helpers (no server-only imports) */

export function parseYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    const v = parsed.searchParams.get("v");
    if (v) return v;
    const embed = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embed?.[1]) return embed[1];
    const shorts = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts?.[1]) return shorts[1];
  } catch {
    return null;
  }
  return null;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
