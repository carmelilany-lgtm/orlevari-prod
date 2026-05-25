"use client";

import { resolveVideoYoutubeId } from "@/lib/youtube/client";
import { useEffect, useId, useRef } from "react";

export interface YouTubeModalPlaceholderProps {
  youtubeId?: string;
  youtubeUrl?: string;
  title: string;
  open: boolean;
  onClose: () => void;
  closeLabel?: string;
}

export function YouTubeModalPlaceholder({
  youtubeId,
  youtubeUrl,
  title,
  open,
  onClose,
  closeLabel = "Close",
}: YouTubeModalPlaceholderProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const resolvedId = resolveVideoYoutubeId({ youtubeId, youtubeUrl });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || !resolvedId) return null;

  const embedSrc = `https://www.youtube.com/embed/${resolvedId}?autoplay=1&rel=0`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-2 end-0 z-10 flex h-10 w-10 translate-y-[-100%] items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:top-0 sm:end-[-3rem] sm:translate-y-0"
        >
          <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p id={titleId} className="sr-only">
          {title}
        </p>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <iframe
            title={title}
            src={embedSrc}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
