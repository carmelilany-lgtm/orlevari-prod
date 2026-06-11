"use client";

import { EditableSectionHeading } from "@/components/visual-editor/EditableSectionHeading";
import { EditableText } from "@/components/visual-editor/EditableText";
import { EditableAboutImage } from "@/components/visual-editor/EditableAboutImage";
import { useVisualEditorActive } from "@/components/visual-editor/VisualEditorProvider";
import {
  getAboutExtendedImageUrl,
  getAboutImageUrl,
} from "@/lib/i18n/about-image";
import { resolveCmsText } from "@/lib/i18n/cms";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function About() {
  const { t, locale, cmsMap, dir } = useLanguage();
  const visualEdit = useVisualEditorActive();
  const aboutImageUrl = getAboutImageUrl(cmsMap);
  const extendedImageUrl = getAboutExtendedImageUrl(cmsMap);
  const displayImageUrl = extendedImageUrl ?? aboutImageUrl ?? null;

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

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding section-surface border-t border-blue-900/25"
    >
      <div className="container-narrow space-y-10 lg:space-y-12">
        <EditableSectionHeading
          id="about-heading"
          titleKey="about_title"
          titleFallback={t.about.title}
        />

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
                "relative mx-auto aspect-[3/4] w-full max-w-[280px] justify-self-center overflow-hidden rounded-2xl bg-[#070b14] ring-1 ring-cyan-400/15 sm:max-w-[300px] lg:max-w-[340px]",
                dir === "rtl" ? "lg:order-2" : "lg:order-1",
              )}
            >
              {displayImageUrl ? (
                <EditableAboutImage
                  imageUrl={displayImageUrl}
                  imageAlt={t.about.extendedImageAlt}
                  fillHeight
                  className="h-full w-full rounded-2xl"
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
              {extendedQuote.trim() || visualEdit ? (
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
      </div>
    </section>
  );
}
