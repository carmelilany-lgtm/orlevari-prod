"use client";

import type { ServiceItem } from "@/types/works";
import type { Locale } from "@/types/i18n";

interface ServiceCardProps {
  service: ServiceItem;
  locale: Locale;
}

export function ServiceCard({ service, locale }: ServiceCardProps) {
  return (
    <article className="card-surface group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
      <h3 className="font-display text-xl font-medium text-slate-50">
        {service.title[locale]}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-slate-400">
        {service.description[locale]}
      </p>
      <div
        className="mt-6 h-px w-12 bg-blue-600/60 transition-all duration-300 group-hover:w-full group-hover:bg-blue-500/80"
        aria-hidden
      />
    </article>
  );
}
