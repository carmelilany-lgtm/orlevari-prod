"use client";

import type { LegalPageContent } from "@/lib/i18n/legal-content";
import { useLanguage } from "@/lib/i18n/context";

export function LegalDocument({ content }: { content: LegalPageContent }) {
  const { dir } = useLanguage();

  return (
    <article className="prose-legal" dir={dir}>
      <header className="mb-10 border-b border-blue-900/30 pb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">{content.updatedLabel}</p>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          {content.intro}
        </p>
      </header>

      <div className="space-y-10">
        {content.sections.map((section, sectionIndex) => (
          <section
            key={section.heading}
            aria-labelledby={`legal-section-${sectionIndex}`}
          >
            <h2
              id={`legal-section-${sectionIndex}`}
              className="text-xl font-semibold text-slate-100 sm:text-2xl"
            >
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-slate-300 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-blue-900/30 pt-8">
        <p className="text-sm leading-relaxed text-slate-500">
          {content.footerNote}
        </p>
      </footer>
    </article>
  );
}
