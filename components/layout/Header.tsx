"use client";

import { BrandLogoLink, HERO_BRAND_LOGO_ID } from "@/components/brand/BrandLogo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const HEADER_LOGO_ROOT_MARGIN = "-72px 0px 0px 0px";

export function Header() {
  const { t, dir, locale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLogoInView, setHeroLogoInView] = useState(true);
  const headerVisible = !heroLogoInView;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const heroLogo = document.getElementById(HERO_BRAND_LOGO_ID);
    if (!heroLogo) {
      const frame = requestAnimationFrame(() => setHeroLogoInView(false));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setHeroLogoInView(inView);
        if (inView) setMenuOpen(false);
      },
      { root: null, rootMargin: HEADER_LOGO_ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(heroLogo);
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "works", label: t.nav.works },
    { id: "contact", label: t.nav.contact },
  ] as const;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.nav.skipToContent}
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 isolate transform-gpu backface-hidden transition-[background-color,box-shadow] duration-300",
          headerVisible
            ? "bg-[#070b14] shadow-[0_1px_0_0_#050a12]"
            : "bg-transparent shadow-[0_1px_0_0_transparent]",
        )}
      >
        <div
          dir="ltr"
          className="container-wide flex h-16 items-center gap-4 px-4 sm:h-18 sm:px-6 lg:px-8"
        >
          <LanguageToggle
            className={cn("shrink-0", locale === "en" && "order-last ms-auto")}
          />
          <div
            dir={dir}
            className={cn(
              "flex min-w-0 items-center gap-3 transition-[opacity,transform] duration-300 md:gap-8",
              headerVisible
                ? "flex-1 translate-y-0 opacity-100"
                : "pointer-events-none w-0 overflow-hidden opacity-0",
            )}
            aria-hidden={!headerVisible}
          >
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/25 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              tabIndex={headerVisible ? undefined : -1}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">
                {menuOpen ? t.nav.menuClose : t.nav.menuOpen}
              </span>
              <svg
                aria-hidden
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <BrandLogoLink href="#hero" alt={t.brand} />
            <nav
              aria-label="Main"
              className="hidden items-center gap-8 md:flex"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  tabIndex={headerVisible ? undefined : -1}
                  className="text-sm font-medium tracking-wide text-slate-400 transition-colors hover:text-cyan-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className={cn(
            "border-t border-blue-900/30 bg-[#070b14]/98 backdrop-blur-lg md:hidden",
            !menuOpen && "pointer-events-none",
          )}
          dir={dir}
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-lg px-3 py-3 text-lg font-medium text-slate-200 transition-colors hover:bg-blue-950/60"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
