"use client";

import { EditableSectionHeading } from "@/components/visual-editor/EditableSectionHeading";
import { EditableText } from "@/components/visual-editor/EditableText";
import { EditableAboutImage } from "@/components/visual-editor/EditableAboutImage";
import {
  getAboutExtendedImageUrl,
  getAboutImageUrl,
} from "@/lib/i18n/about-image";
import { resolveCmsText } from "@/lib/i18n/cms";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function About() {
  const { t, locale, cmsMap, dir } = useLanguage();
  const aboutImageUrl = getAboutImageUrl(cmsMap);
  const extendedImageUrl =
    getAboutExtendedImageUrl(cmsMap) ?? aboutImageUrl ?? null;

  const introFallback = resolveCmsText(
    cmsMap,
    "about_text",
    locale,
    t.about.body,
  );
  const intro = resolveCmsText(
    cmsMap,
    "about_intro",
    locale,
    introFallback,
  );
  const extendedTitle = resolveCmsText(
    cmsMap,
    "about_extended_title",
    locale,
    t.about.extendedTitle,
  );
  const extendedText = resolveCmsText(
    cmsMap,
    "about_extended_text",
    locale,
    t.about.extendedText,
  );
  const extendedQuote = resolveCmsText(
    cmsMap,
    "about_extended_quote",
    locale,
    t.about.extendedQuote,
  );

  const showExtended =
    Boolean(extendedTitle.trim()) ||
    Boolean(extendedText.trim()) ||
    Boolean(extendedQuote.trim()) ||
    Boolean(extendedImageUrl);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding section-surface border-t border-blue-900/25"
    >
      <div className="container-narrow space-y-14 lg:space-y-16">
        <div>
          <EditableSectionHeading
            id="about-heading"
            titleKey="about_title"
            titleFallback={t.about.title}
          />
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
            <EditableAboutImage
              imageUrl={aboutImageUrl}
              imageAlt={t.about.imageAlt}
              className="mx-auto aspect-[16/10] max-h-none max-w-none rounded-2xl lg:mx-0"
            />
            <div className="flex flex-col justify-center">
              <EditableText
                as="p"
                contentKey="about_intro"
                fallback={intro}
                className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-8 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden"
              />
            </div>
          </div>
        </div>

        {showExtended ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#0a1628] via-[#0c1a32] to-[#070d18] p-6 shadow-[0_0_60px_rgba(37,99,235,0.12)] sm:p-8 lg:p-10",
              dir === "rtl" ? "text-right" : "text-left",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.08),transparent_55%)]"
              aria-hidden
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <div
                className={cn(
                  "relative aspect-[4/5] max-h-[420px] w-full overflow-hidden rounded-2xl ring-1 ring-cyan-400/15",
                  dir === "rtl" ? "lg:order-2" : "lg:order-1",
                )}
              >
                {extendedImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={extendedImageUrl}
                    alt={t.about.extendedImageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/35 via-slate-900/55 to-[#070b14]" />
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(56,189,248,0.12),transparent_60%)]"
                      aria-hidden
                    />
                  </>
                )}
              </div>

              <div
                className={cn(
                  "flex flex-col gap-5",
                  dir === "rtl" ? "lg:order-1" : "lg:order-2",
                )}
              >
                <EditableText
                  as="div"
                  contentKey="about_extended_title"
                  fallback={extendedTitle}
                  className="font-display text-2xl font-medium text-white sm:text-3xl lg:text-4xl"
                />
                <EditableText
                  as="p"
                  contentKey="about_extended_text"
                  fallback={extendedText}
                  className="max-w-prose text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-8"
                />
                {extendedQuote.trim() ? (
                  <blockquote className="rounded-2xl border border-cyan-400/20 bg-blue-950/40 px-5 py-4 text-base italic leading-relaxed text-cyan-100/90 sm:text-lg">
                    <EditableText
                      as="span"
                      contentKey="about_extended_quote"
                      fallback={extendedQuote}
                      className="block"
                    />
                  </blockquote>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
