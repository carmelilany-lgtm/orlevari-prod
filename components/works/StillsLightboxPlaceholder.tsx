"use client";

import { stillAlt, type StillWorkItem } from "@/types/works";
import type { Locale } from "@/types/i18n";
import { useEffect, useId, useRef } from "react";

export interface StillsLightboxPlaceholderProps {
  images: StillWorkItem[];
  index: number;
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  closeLabel?: string;
}

export function StillsLightboxPlaceholder({
  images,
  index,
  locale,
  open,
  onClose,
  onIndexChange,
  closeLabel = "Close",
}: StillsLightboxPlaceholderProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = images[index];
  const hasMultiple = images.length > 1;
  const prevLabel = locale === "he" ? "תמונה קודמת" : "Previous image";
  const nextLabel = locale === "he" ? "תמונה הבאה" : "Next image";

  const goPrev = () => {
    if (!hasMultiple) return;
    onIndexChange((index - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    onIndexChange((index + 1) % images.length);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(
          locale === "he"
            ? (index + 1) % images.length
            : (index - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange(
          locale === "he"
            ? (index - 1 + images.length) % images.length
            : (index + 1) % images.length,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, index, locale, images.length, hasMultiple, onClose, onIndexChange]);

  if (!open || !current?.image_url) return null;

  const alt = stillAlt(current, locale);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-6xl flex-col items-center"
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
          {alt}
        </p>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={prevLabel}
              className="absolute start-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:start-[-3.5rem]"
            >
              <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={nextLabel}
              className="absolute end-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:end-[-3.5rem]"
            >
              <svg aria-hidden className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element -- Supabase public URLs */}
        <img
          src={current.image_url}
          alt={alt}
          className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
          decoding="async"
        />
      </div>
    </div>
  );
}
