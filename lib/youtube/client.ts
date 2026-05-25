/** Client-safe YouTube helpers (no server-only imports) */

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "www.youtube.com",
]);

function sanitizeYoutubeId(id: string | undefined | null): string | null {
  if (!id) return null;
  const clean = id.split("&")[0].split("?")[0].trim();
  if (!clean || !/^[\w-]{6,20}$/.test(clean)) return null;
  return clean;
}

function normalizeYoutubeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Extract a YouTube video ID from common URL formats.
 * Returns null for invalid or unrecognized input.
 */
export function parseYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(normalizeYoutubeUrl(trimmed));
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return sanitizeYoutubeId(id);
    }

    if (YOUTUBE_HOSTS.has(host) || host.endsWith(".youtube.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return sanitizeYoutubeId(fromQuery);

      const path = parsed.pathname;
      const pathPatterns = [
        /^\/embed\/([^/?]+)/,
        /^\/shorts\/([^/?]+)/,
        /^\/v\/([^/?]+)/,
        /^\/live\/([^/?]+)/,
      ];
      for (const pattern of pathPatterns) {
        const match = path.match(pattern);
        if (match?.[1]) return sanitizeYoutubeId(match[1]);
      }
    }
  } catch {
    return null;
  }

  return null;
}

/** Alias for consistent naming in new code */
export const parseYouTubeId = parseYoutubeId;

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function resolveVideoYoutubeId(item: {
  youtubeId?: string;
  youtubeUrl?: string;
}): string | null {
  const stored = item.youtubeId?.trim();
  if (stored) {
    return sanitizeYoutubeId(stored) ?? parseYoutubeId(stored);
  }
  if (item.youtubeUrl?.trim()) {
    return parseYoutubeId(item.youtubeUrl.trim());
  }
  return null;
}

/** Thumbnail priority: custom cover → stored thumbnail → YouTube CDN */
export function getVideoThumbnailSrc(item: {
  customCoverUrl?: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  youtubeUrl?: string;
}): string | null {
  const custom = item.customCoverUrl?.trim();
  if (custom) return custom;

  const stored = item.thumbnailUrl?.trim();
  if (stored) return stored;

  const youtubeId = resolveVideoYoutubeId(item);
  if (youtubeId) return youtubeThumbnailUrl(youtubeId);

  return null;
}
