"use client";

import { BrandLogoLink, HERO_BRAND_LOGO_ID } from "@/components/brand/BrandLogo";
import { EditableText } from "@/components/visual-editor/EditableText";
import { useVisualEditorActive } from "@/components/visual-editor/VisualEditorProvider";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";
import { stillAlt, type StillWorkItem } from "@/types/works";
import { CdnImage } from "@/components/media/CdnImage";
import {
  HERO_CELL_SIZES,
  HERO_FEATURE_SIZES,
} from "@/lib/images/cdn-sizes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const COLLAGE_CELLS = 6;

const cellGradients = [
  "from-blue-900/40 via-slate-900/50 to-[#070b14]",
  "from-indigo-800/35 via-blue-950/60 to-[#050a12]",
  "from-cyan-900/25 via-slate-900/55 to-[#0a1020]",
  "from-sky-800/30 via-slate-900/65 to-[#070b14]",
  "from-blue-800/40 via-slate-800/50 to-[#060c18]",
  "from-teal-900/20 via-blue-950/70 to-[#050a12]",
];

const heroButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";

type HeroProps = {
  heroCells: StillWorkItem[];
};

type HeroCollageGridProps = {
  heroCells: StillWorkItem[];
  locale: "en" | "he";
};

function HeroCollageGrid({ heroCells, locale }: HeroCollageGridProps) {
  const imageIndexes = Array.from({ length: COLLAGE_CELLS }).flatMap((_, i) =>
    heroCells[i]?.image_url ? [i] : [],
  );
  const [settled, setSettled] = useState<Record<number, true>>({});
  const [giveUp, setGiveUp] = useState(false);

  useEffect(() => {
    if (imageIndexes.length === 0) return;
    const id = window.setTimeout(() => setGiveUp(true), 2500);
    return () => window.clearTimeout(id);
  }, [imageIndexes.length]);

  const collageReady =
    imageIndexes.length === 0 ||
    giveUp ||
    imageIndexes.every((i) => settled[i]);

  function markCellSettled(index: number) {
    setSettled((current) =>
      current[index] ? current : { ...current, [index]: true },
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl p-2 sm:gap-3">
      {Array.from({ length: COLLAGE_CELLS }).map((_, i) => {
        const still = heroCells[i];
        const hasImage = Boolean(still?.image_url);
        const isFeature = i === 0;

        return (
          <div
            key={still ? `${still.id}-${i}` : `placeholder-${i}`}
            className={cn(
              "hero-collage-cell relative overflow-hidden rounded-lg ring-1 ring-blue-500/10",
              isFeature && "col-span-2 row-span-2",
            )}
          >
            {hasImage && still?.image_url ? (
              <CdnImage
                src={still.image_url}
                alt={stillAlt(still, locale)}
                fill
                sizes={isFeature ? HERO_FEATURE_SIZES : HERO_CELL_SIZES}
                priority
                fetchPriority="high"
                revealed={collageReady}
                className="object-cover"
                onLoad={() => markCellSettled(i)}
                onError={() => markCellSettled(i)}
              />
            ) : (
              <div
                className={cn(
                  "h-full min-h-[80px] w-full bg-gradient-to-br",
                  cellGradients[i % cellGradients.length],
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Hero({ heroCells }: HeroProps) {
  const { t, locale, dir } = useLanguage();
  const visualEdit = useVisualEditorActive();
  const [copyEntered, setCopyEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCopyEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#070b14]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1a2e]/60 via-[#070b14]/85 to-[#050a12]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(37,99,235,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,rgba(34,211,238,0.08),transparent_45%)]" />
        <div className="blue-radial-glow absolute inset-0" aria-hidden />
      </div>

      <div
        dir={dir}
        className="container-wide relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-32"
      >
        <div
          className={cn(
            "hero-copy flex w-full flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-start",
            copyEntered && "hero-enter",
          )}
        >
          <BrandLogoLink
            id={HERO_BRAND_LOGO_ID}
            href="#hero"
            alt={t.brand}
            priority
            heightClassName="h-16 sm:h-18 lg:h-20"
            sizes="(max-width: 640px) 288px, (max-width: 1024px) 352px, 384px"
            className="mb-8 self-center"
            imageClassName="max-w-[min(100%,18rem)] sm:max-w-[22rem] lg:max-w-[24rem]"
          />
          <EditableText
            as="h1"
            id="hero-title"
            contentKey="hero_subtitle"
            fallback={t.hero.subtitle}
            className="font-display max-w-4xl text-center text-2xl font-medium leading-snug tracking-tight text-slate-200 sm:text-3xl sm:leading-snug lg:text-4xl lg:leading-tight"
          />
          <div className="mt-10 flex w-full flex-wrap justify-center gap-4">
            {visualEdit ? (
              <>
                <span
                  className={cn(
                    heroButtonClass,
                    "border border-blue-400/20 bg-blue-600 text-white shadow-lg shadow-blue-900/40",
                  )}
                >
                  <EditableText
                    as="span"
                    contentKey="hero_primary_button"
                    fallback={t.hero.ctaWorks}
                  />
                </span>
                <span
                  className={cn(
                    heroButtonClass,
                    "border border-blue-500/30 bg-blue-950/40 text-slate-100",
                  )}
                >
                  <EditableText
                    as="span"
                    contentKey="hero_secondary_button"
                    fallback={t.hero.ctaContact}
                  />
                </span>
              </>
            ) : (
              <>
                <Button asChild href="#works" variant="primary">
                  <EditableText
                    as="span"
                    contentKey="hero_primary_button"
                    fallback={t.hero.ctaWorks}
                  />
                </Button>
                <Button asChild href="#contact" variant="secondary">
                  <EditableText
                    as="span"
                    contentKey="hero_secondary_button"
                    fallback={t.hero.ctaContact}
                  />
                </Button>
              </>
            )}
          </div>
        </div>

        <div
          className="relative aspect-[4/3] w-full max-lg:max-h-[50vh] lg:aspect-square"
          role="img"
          aria-label={t.hero.collageLabel}
        >
          <HeroCollageGrid
            key={heroCells.map((cell) => cell.id).join("-")}
            heroCells={heroCells}
            locale={locale}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[#070b14]/90 via-transparent to-[#070b14]/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-400/15 shadow-[0_0_60px_rgba(37,99,235,0.12)]"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
