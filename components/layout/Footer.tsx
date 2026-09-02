"use client";

import { BrandLogoLink } from "@/components/brand/BrandLogo";
import { useLanguage } from "@/lib/i18n/context";
import { withLocalePrefix } from "@/lib/i18n/locale-path";

const CIMEDIA_URL = "https://cimedia.co.il";

export function Footer() {
  const { t, locale } = useLanguage();

  const links = [
    {
      href: withLocalePrefix(locale, "/privacy-policy"),
      label: t.footer.privacy,
    },
    {
      href: withLocalePrefix(locale, "/accessibility-statement"),
      label: t.footer.accessibility,
    },
  ];

  return (
    <footer className="border-t border-blue-900/30 bg-[#050a12]">
      <div className="container-wide flex flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <BrandLogoLink href={`${withLocalePrefix(locale, "/")}#hero`} alt={t.brand} />
          <p className="text-center text-sm font-light text-slate-500 sm:text-start">
            {t.footer.rights}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-slate-400 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container-wide border-t border-blue-900/20 px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-slate-600 sm:text-start">
          <span>{t.footer.creditPrefix} </span>
          <a
            href={CIMEDIA_URL}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            aria-label={t.footer.cimediaAriaLabel}
            className="text-slate-500 underline-offset-2 transition-colors hover:text-cyan-400/90 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
          >
            Cimedia
          </a>
        </p>
      </div>
    </footer>
  );
}
