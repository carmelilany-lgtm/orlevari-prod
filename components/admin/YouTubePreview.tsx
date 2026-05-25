"use client";

import { cn } from "@/lib/utils";

type Props = {
  youtubeId: string | null;
  customCoverUrl?: string | null;
  title?: string;
  className?: string;
};

export function YouTubePreview({
  youtubeId,
  customCoverUrl,
  title,
  className,
}: Props) {
  const src =
    customCoverUrl?.trim() ||
    (youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : null);

  if (!src) {
    return (
      <div
        className={cn(
          "flex h-24 w-40 items-center justify-center rounded-lg border border-dashed border-blue-900/50 bg-blue-950/30 text-xs text-slate-500",
          className,
        )}
      >
        No preview
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title ? `Preview: ${title}` : "Video thumbnail"}
      className={cn("h-24 w-40 rounded-lg object-cover", className)}
    />
  );
}
