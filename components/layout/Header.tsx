"use client";

import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV_IDS = ["about", "works", "services", "contact"] as const;

export function Header() {
  const { t, dir } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "works", label: t.nav.works },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ] as const;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-blue-900/30 bg-[#070b14]/92 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.nav.skipToContent}
      </a>

      <div className="container-wide flex h-16 items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="font-display text-base font-semibold tracking-wide text-slate-100 transition-colors hover:text-cyan-300 sm:text-lg"
        >
          {t.brand}
        </a>

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 md:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-base text-slate-400 transition-colors hover:text-cyan-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/25 text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
              className="rounded-lg px-3 py-3 text-lg text-slate-200 transition-colors hover:bg-blue-950/60"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-4 border-t border-blue-900/30 pt-4">
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
