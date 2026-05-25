"use client";

import { getVideoThumbnailSrc } from "@/lib/youtube/client";
import type { VideoWorkItem } from "@/types/works";
import type { Locale } from "@/types/i18n";
import { useState } from "react";

interface VideoWorkCardProps {
  item: VideoWorkItem;
  locale: Locale;
  onOpen: (item: VideoWorkItem) => void;
  playLabel: string;
}

export function VideoWorkCard({
  item,
  locale,
  onOpen,
  playLabel,
}: VideoWorkCardProps) {
  const thumbnailSrc = getVideoThumbnailSrc(item);
  const [thumbFailed, setThumbFailed] = useState(false);
  const showThumbnail = thumbnailSrc && !thumbFailed;

  return (
    <article className="group card-surface overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        aria-label={`${playLabel}: ${item.title[locale]}`}
      >
        <div className="relative aspect-video overflow-hidden bg-[#0a1220]">
          {showThumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube CDN + Supabase covers
            <img
              src={thumbnailSrc}
              alt={item.title[locale]}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setThumbFailed(true)}
            />
          ) : (
            <div className="video-thumbnail-placeholder absolute inset-0" />
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(56,189,248,0.12),transparent_50%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/30 bg-blue-600/90 text-white opacity-90 shadow-[0_0_28px_rgba(37,99,235,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-300/50 group-hover:bg-blue-500 group-hover:opacity-100 sm:h-16 sm:w-16">
              <svg
                aria-hidden
                className="h-7 w-7 ms-0.5 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="border-t border-blue-500/10 p-4 sm:p-5">
          <h3 className="text-lg font-medium leading-snug text-slate-100 sm:text-xl">
            {item.title[locale]}
          </h3>
        </div>
      </button>
    </article>
  );
}
