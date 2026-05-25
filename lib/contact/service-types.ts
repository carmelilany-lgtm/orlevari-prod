import type { Locale } from "@/types/i18n";
import type { ServiceItem } from "@/types/works";

export interface ServiceTypeOption {
  label: string;
  value: string;
}

export interface ServiceTypeCategoryInput {
  label: { en: string; he: string };
}

const OTHER_LABEL: Record<Locale, string> = {
  en: "Other",
  he: "אחר",
};

/** Published services + video categories for the contact form dropdown */
export function buildServiceTypeOptions(
  services: ServiceItem[],
  categories: ServiceTypeCategoryInput[],
  locale: Locale,
): ServiceTypeOption[] {
  const labels: string[] = [];

  for (const service of services) {
    const label = service.title[locale]?.trim();
    if (label) labels.push(label);
  }

  for (const category of categories) {
    const label = category.label[locale]?.trim();
    if (label) labels.push(label);
  }

  const unique = [...new Set(labels)];
  const options: ServiceTypeOption[] = unique.map((label) => ({
    label,
    value: label,
  }));

  const otherLabel = OTHER_LABEL[locale];
  options.push({ label: otherLabel, value: otherLabel });

  return options;
}
