"use client";

import { BrandLogoLink } from "@/components/brand/BrandLogo";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityWidget } from "@/components/a11y/AccessibilityWidget";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { useLanguage } from "@/lib/i18n/context";
import Link from "next/link";

export function LegalPageChrome({ children }: { children: React.ReactNode }) {
  const { t, dir } = useLanguage();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.nav.skipToContent}
      </a>
      <header className="sticky top-0 z-50 isolate bg-[#070b14]/95 shadow-[0_1px_0_0_#050a12] backdrop-blur-md supports-[backdrop-filter]:bg-[#070b14]/90">
        <div className="container-wide flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandLogoLink href="/" alt={t.brand} priority />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-400 transition-colors hover:text-cyan-200 sm:text-base"
            >
              {t.legal.backToHome}
            </Link>
            <LanguageToggle />
            <AccessibilityWidget panelAlign="end" />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        dir={dir}
      >
        <div className="container-narrow mx-auto max-w-3xl">{children}</div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
