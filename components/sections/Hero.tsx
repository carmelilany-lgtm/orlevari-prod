"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const COLLAGE_CELLS = 6;

const cellGradients = [
  "from-blue-900/40 via-slate-900/50 to-[#070b14]",
  "from-indigo-800/35 via-blue-950/60 to-[#050a12]",
  "from-cyan-900/25 via-slate-900/55 to-[#0a1020]",
  "from-sky-800/30 via-slate-900/65 to-[#070b14]",
  "from-blue-800/40 via-slate-800/50 to-[#060c18]",
  "from-teal-900/20 via-blue-950/70 to-[#050a12]",
];

export function Hero() {
  const { t, cms } = useLanguage();

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

      <div className="container-wide relative z-10 grid min-h-[100svh] items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-32">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="font-display text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
          >
            <span className="gradient-text">
              {cms("hero_title", t.hero.title)}
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
            {cms("hero_subtitle", t.hero.subtitle)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild href="#works" variant="primary">
              {cms("hero_primary_button", t.hero.ctaWorks)}
            </Button>
            <Button asChild href="#contact" variant="secondary">
              {cms("hero_secondary_button", t.hero.ctaContact)}
            </Button>
          </div>
        </div>

        <div
          className="relative aspect-[4/3] w-full max-lg:max-h-[50vh] lg:aspect-square"
          role="img"
          aria-label={t.hero.collageLabel}
        >
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl p-2 sm:gap-3">
            {Array.from({ length: COLLAGE_CELLS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "hero-collage-cell overflow-hidden rounded-lg ring-1 ring-blue-500/10",
                  i === 0 && "col-span-2 row-span-2",
                )}
              >
                <div
                  className={cn(
                    "h-full min-h-[80px] w-full bg-gradient-to-br",
                    cellGradients[i % cellGradients.length],
                  )}
                />
              </div>
            ))}
          </div>
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
