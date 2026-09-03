export const PUBLIC_MEDIA_BUCKETS = ["stills", "about", "covers"] as const;

export type PublicMediaBucket = (typeof PUBLIC_MEDIA_BUCKETS)[number];

const PUBLIC_OBJECT_PATH =
  /^\/storage\/v1\/object\/public\/(stills|about|covers)\/(.+)$/;

function isPublicMediaBucket(value: string): value is PublicMediaBucket {
  return (PUBLIC_MEDIA_BUCKETS as readonly string[]).includes(value);
}

/**
 * Rewrite Supabase Storage public URLs to same-origin `/media/...` so browsers
 * and image optimization hit Vercel cache instead of Storage cached egress.
 */
export function toCachedMediaUrl(src: string): string {
  const value = src.trim();
  if (!value || value.startsWith("/media/")) return value;
  if (value.startsWith("blob:") || value.startsWith("data:")) return value;

  try {
    const url = new URL(value);
    if (!url.hostname.endsWith(".supabase.co") && !url.hostname.endsWith(".supabase.in")) {
      return value;
    }
    const match = url.pathname.match(PUBLIC_OBJECT_PATH);
    if (!match) return value;
    const bucket = match[1];
    const objectPath = match[2];
    if (!isPublicMediaBucket(bucket) || objectPath.includes("..")) return value;
    return `/media/${bucket}/${objectPath}`;
  } catch {
    return value;
  }
}

export function isPublicMediaBucketName(value: string): value is PublicMediaBucket {
  return isPublicMediaBucket(value);
}
