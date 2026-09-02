"use client";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/i18n";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "en", label: "EN", name: "English" },
  { value: "he", label: "HE", name: "Hebrew" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      dir="ltr"
      className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.16em]", className)}
    >
      {OPTIONS.map((opt, index) => (
        <span key={opt.value} className="inline-flex items-center gap-1.5">
          {index > 0 ? (
            <span aria-hidden className="font-light text-zinc-600">
              /
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLocale(opt.value)}
            aria-label={opt.name}
            aria-pressed={locale === opt.value}
            className={cn(
              "transition-colors duration-200",
              locale === opt.value
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}
