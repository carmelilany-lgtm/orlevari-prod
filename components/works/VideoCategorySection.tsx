"use client";

import { VideoWorkCard } from "@/components/works/VideoWorkCard";
import {
  VIDEO_CATEGORY_INITIAL_VISIBLE,
  VIDEO_CATEGORY_LOAD_MORE_STEP,
} from "@/data/works-display-config";
import type { VideoCategory } from "@/data/video-categories";
import type { Locale } from "@/types/i18n";
import type { VideoWorkItem } from "@/types/works";
import { useState } from "react";

interface VideoCategorySectionProps {
  category: VideoCategory;
  items: VideoWorkItem[];
  locale: Locale;
  playLabel: string;
  loadMoreLabel: string;
  closeLabel: string;
  onOpenVideo: (item: VideoWorkItem) => void;
  /** Per-category initial count from Supabase */
  initialVisible?: number;
}

export function VideoCategorySection({
  category,
  items,
  locale,
  playLabel,
  loadMoreLabel,
  closeLabel,
  onOpenVideo,
  initialVisible = VIDEO_CATEGORY_INITIAL_VISIBLE,
}: VideoCategorySectionProps) {
  const initialCount = Math.max(
    1,
    Math.min(initialVisible, VIDEO_CATEGORY_INITIAL_VISIBLE),
  );
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visible = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;
  const canCollapse = visibleCount > initialCount;

  return (
    <section aria-labelledby={`category-${category.id}`}>
      <h3
        id={`category-${category.id}`}
        className="mb-6 font-display text-xl font-medium text-slate-100 sm:text-2xl"
      >
        {category.label[locale]}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {visible.map((item) => (
          <VideoWorkCard
            key={item.id}
            item={item}
            locale={locale}
            playLabel={playLabel}
            onOpen={onOpenVideo}
          />
        ))}
      </div>
      {hasMore || canCollapse ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (hasMore) {
                setVisibleCount((count) =>
                  Math.min(count + VIDEO_CATEGORY_LOAD_MORE_STEP, items.length),
                );
              } else {
                setVisibleCount(initialCount);
              }
            }}
            aria-expanded={visibleCount >= items.length}
            className="rounded-full border border-blue-500/30 bg-blue-950/30 px-7 py-3 text-base text-slate-200 transition-all duration-300 hover:border-cyan-400/50 hover:bg-blue-900/40 hover:text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            {hasMore ? loadMoreLabel : closeLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}
