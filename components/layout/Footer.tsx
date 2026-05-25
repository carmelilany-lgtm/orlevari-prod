"use client";

import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();

  const links = [
    { href: "#", label: t.footer.privacy },
    { href: "#", label: t.footer.accessibility },
  ];

  return (
    <footer className="border-t border-blue-900/30 bg-[#050a12]">
      <div className="container-wide flex flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-base text-slate-500 sm:text-start">
          {t.footer.rights}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base text-slate-400 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
