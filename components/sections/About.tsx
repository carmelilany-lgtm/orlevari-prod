"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n/context";

export function About() {
  const { t, cms } = useLanguage();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding section-surface border-t border-blue-900/25"
    >
      <div className="container-narrow">
        <SectionHeading
          id="about-heading"
          title={cms("about_title", t.about.title)}
        />
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:gap-12">
          <div
            className="relative mx-auto aspect-[4/5] w-full max-h-[280px] max-w-[240px] overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.1)] ring-1 ring-cyan-400/15 sm:max-h-[300px] sm:max-w-[260px] lg:mx-0 lg:max-h-[320px] lg:max-w-none"
            role="img"
            aria-label={t.about.imageAlt}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/35 via-slate-900/55 to-[#070b14]" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(56,189,248,0.12),transparent_60%)]"
              aria-hidden
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              {cms("about_text", t.about.body)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
