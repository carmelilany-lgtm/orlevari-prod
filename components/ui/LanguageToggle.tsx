"use client";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/i18n";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: t.langToggle.en },
    { value: "he", label: t.langToggle.he },
  ];

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex rounded-full border border-zinc-700/80 bg-zinc-900/60 p-0.5 text-xs",
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLocale(opt.value)}
          aria-pressed={locale === opt.value}
          className={cn(
            "rounded-full px-3 py-1.5 font-medium transition-colors duration-200",
            locale === opt.value
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
