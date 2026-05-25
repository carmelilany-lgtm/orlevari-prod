"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { StillsMasonryGallery } from "@/components/works/StillsMasonryGallery";
import { VideoWorkGrid } from "@/components/works/VideoWorkGrid";
import { WorkFilters } from "@/components/works/WorkFilters";
import { useLanguage } from "@/lib/i18n/context";
import type { WorkFilter } from "@/types/works";
import { useState } from "react";

export function Works() {
  const { t, cms } = useLanguage();
  const [filter, setFilter] = useState<WorkFilter>("all");

  const showVideo = filter === "all" || filter === "video";
  const showStills = filter === "all" || filter === "stills";

  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="section-padding relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.1),transparent_60%)]"
        aria-hidden
      />
      <div className="container-wide relative">
        <SectionHeading
          id="works-heading"
          title={cms("works_title", t.works.title)}
          subtitle={t.works.subtitle}
        />
        <div className="mb-10">
          <WorkFilters
            active={filter}
            onChange={setFilter}
            labels={t.works.filters}
          />
        </div>
        {showVideo ? <VideoWorkGrid /> : null}
        {showStills ? (
          <div
            className={
              showVideo
                ? "mt-16 border-t border-blue-900/30 pt-16"
                : ""
            }
          >
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <StillsMasonryGallery />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
