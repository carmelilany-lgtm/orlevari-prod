"use client";

import { VideoCategorySection } from "@/components/works/VideoCategorySection";
import { YouTubeModalPlaceholder } from "@/components/works/YouTubeModalPlaceholder";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { useLanguage } from "@/lib/i18n/context";
import type { VideoWorkItem } from "@/types/works";
import { useMemo, useState } from "react";

export function VideoWorkGrid() {
  const { locale, t } = useLanguage();
  const { categories, videoWorks } = useSiteData();
  const [modalItem, setModalItem] = useState<VideoWorkItem | null>(null);

  const worksByCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: videoWorks.filter((w) => w.categoryId === category.id),
      })),
    [categories, videoWorks],
  );

  return (
    <div aria-label={t.works.videoSectionLabel} className="space-y-14">
      {worksByCategory.map(({ category, items }) => (
        <VideoCategorySection
          key={category.id}
          category={category}
          items={items}
          locale={locale}
          playLabel={t.works.openVideo}
          loadMoreLabel={t.works.loadMore}
          closeLabel={t.works.close}
          onOpenVideo={setModalItem}
        />
      ))}

      <YouTubeModalPlaceholder
        open={!!modalItem}
        youtubeId={modalItem?.youtubeId}
        title={modalItem ? modalItem.title[locale] : ""}
        onClose={() => setModalItem(null)}
      />
    </div>
  );
}
