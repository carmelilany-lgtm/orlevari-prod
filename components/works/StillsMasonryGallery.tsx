"use client";

import { StillsLightboxPlaceholder } from "@/components/works/StillsLightboxPlaceholder";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  stillAlt,
  stillAspectRatio,
  type StillWorkItem,
} from "@/types/works";
import { useMemo, useState } from "react";

/** Spread aspect ratios so column heads are not all the same shape */
function interleaveForMasonry(items: StillWorkItem[]): StillWorkItem[] {
  const portrait: StillWorkItem[] = [];
  const landscape: StillWorkItem[] = [];
  const square: StillWorkItem[] = [];
  const wide: StillWorkItem[] = [];

  for (const item of items) {
    const ratio = stillAspectRatio(item) ?? 1;
    if (ratio > 1.55) wide.push(item);
    else if (ratio > 1.12) landscape.push(item);
    else if (ratio < 0.88) portrait.push(item);
    else square.push(item);
  }

  const buckets = [wide, landscape, portrait, square];
  const result: StillWorkItem[] = [];
  while (result.length < items.length) {
    for (const bucket of buckets) {
      const next = bucket.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

const variantOverlays = [
  "from-blue-900/55 via-slate-900/70 to-[#070b14]",
  "from-indigo-900/50 via-blue-950/75 to-[#050a14]",
  "from-cyan-900/35 via-slate-900/70 to-[#0a1020]",
  "from-sky-900/45 via-slate-950/75 to-[#070b14]",
  "from-blue-800/40 via-slate-800/65 to-[#060c18]",
  "from-teal-900/30 via-blue-950/80 to-[#050a12]",
  "from-violet-900/40 via-slate-900/72 to-[#080e1a]",
  "from-slate-800/50 via-blue-900/60 to-[#050810]",
  "from-cyan-800/35 via-indigo-950/70 to-[#0a1220]",
  "from-blue-950/60 via-slate-900/75 to-[#040810]",
  "from-indigo-800/45 via-slate-950/68 to-[#070c16]",
  "from-sky-950/50 via-blue-900/65 to-[#060a14]",
];

function StillTile({
  item,
  locale,
  openLabel,
  onSelect,
}: {
  item: StillWorkItem;
  locale: "en" | "he";
  openLabel: string;
  onSelect: (item: StillWorkItem) => void;
}) {
  const variant = item.variant ?? 0;
  const gradient = variantOverlays[variant % variantOverlays.length];
  const label = stillAlt(item, locale);
  const ratio = stillAspectRatio(item);
  const aspectStyle =
    item.width && item.height
      ? { aspectRatio: `${item.width} / ${item.height}` }
      : ratio
        ? { aspectRatio: ratio }
        : { aspectRatio: "4 / 3" };

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${openLabel}: ${label}`}
      className={cn(
        "still-mosaic-item group cursor-pointer",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400",
      )}
    >
      {item.image_url ? (
        // Native img preserves natural aspect ratio; next/image fill+object-cover is avoided
        // eslint-disable-next-line @next/next/no-img-element -- Supabase uploads, lazy + async decode
        <img
          src={item.image_url}
          alt={label}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
          className="still-mosaic-image"
        />
      ) : (
        <div
          className={cn(
            "still-placeholder relative block w-full bg-gradient-to-br",
            gradient,
          )}
          style={aspectStyle}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
            style={{
              backgroundImage: `radial-gradient(circle at ${25 + (variant % 4) * 15}% ${15 + (variant % 3) * 25}%, rgba(56,189,248,0.18), transparent 50%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </div>
      )}
    </button>
  );
}

export function StillsMasonryGallery() {
  const { locale, t } = useLanguage();
  const { stills } = useSiteData();
  const [active, setActive] = useState<StillWorkItem | null>(null);

  const visibleStills = useMemo(() => {
    const sorted = stills.filter((item) => item.published !== false).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
    return interleaveForMasonry(sorted);
  }, [stills]);

  return (
    <div aria-label={t.works.stillsSectionLabel}>
      <div className="masonry-columns">
        {visibleStills.map((item) => (
          <StillTile
            key={item.id}
            item={item}
            locale={locale}
            openLabel={t.works.openStill}
            onSelect={setActive}
          />
        ))}
      </div>

      <StillsLightboxPlaceholder
        open={!!active}
        stillId={active?.id ?? ""}
        title={active ? stillAlt(active, locale) : ""}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
