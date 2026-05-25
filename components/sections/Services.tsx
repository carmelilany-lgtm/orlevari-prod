"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { EditableSectionHeading } from "@/components/visual-editor/EditableSectionHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { useVisualEditorActive } from "@/components/visual-editor/VisualEditorProvider";
import { useLanguage } from "@/lib/i18n/context";

export function Services() {
  const { locale, t, cms } = useLanguage();
  const visualEdit = useVisualEditorActive();
  const { services, isLiveData } = useSiteData();

  if (isLiveData && services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-padding section-surface border-t border-blue-900/25"
    >
      <div className="container-wide">
        {visualEdit ? (
          <EditableSectionHeading
            id="services-heading"
            titleKey="services_title"
            titleFallback={t.services.title}
          />
        ) : (
          <SectionHeading
            id="services-heading"
            title={cms("services_title", t.services.title)}
            subtitle={t.services.subtitle}
          />
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
