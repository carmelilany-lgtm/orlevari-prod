"use client";

import { EditableSectionHeading } from "@/components/visual-editor/EditableSectionHeading";
import { EditableText } from "@/components/visual-editor/EditableText";
import { EditableAboutImage } from "@/components/visual-editor/EditableAboutImage";
import { getAboutImageUrl } from "@/lib/i18n/about-image";
import { useLanguage } from "@/lib/i18n/context";

export function About() {
  const { t, cmsMap } = useLanguage();
  const aboutImageUrl = getAboutImageUrl(cmsMap);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding section-surface border-t border-blue-900/25"
    >
      <div className="container-narrow">
        <EditableSectionHeading
          id="about-heading"
          titleKey="about_title"
          titleFallback={t.about.title}
        />
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:gap-12">
          <EditableAboutImage
            imageUrl={aboutImageUrl}
            imageAlt={t.about.imageAlt}
          />
          <div className="flex flex-col justify-center">
            <EditableText
              as="p"
              contentKey="about_text"
              fallback={t.about.body}
              className="text-lg leading-relaxed text-slate-300 sm:text-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
