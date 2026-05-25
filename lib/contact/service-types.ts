import type { Locale } from "@/types/i18n";
import type { ServiceItem } from "@/types/works";

export interface ServiceTypeOption {
  label: string;
  value: string;
}

const OTHER_LABEL: Record<Locale, string> = {
  en: "Other",
  he: "אחר",
};

/** Published services only (matches /#services section), plus "Other" */
export function buildServiceTypeOptions(
  services: ServiceItem[],
  locale: Locale,
): ServiceTypeOption[] {
  const seen = new Set<string>();
  const options: ServiceTypeOption[] = [];

  for (const service of services) {
    const label = service.title[locale]?.trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    options.push({ label, value: label });
  }

  const otherLabel = OTHER_LABEL[locale];
  if (!seen.has(otherLabel)) {
    options.push({ label: otherLabel, value: otherLabel });
  }

  return options;
}
