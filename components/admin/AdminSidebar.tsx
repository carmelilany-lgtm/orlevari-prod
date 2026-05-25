"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminCopy } from "@/lib/admin/copy";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: adminCopy.nav.dashboard, exact: true },
  { href: "/admin/categories", label: adminCopy.nav.categories },
  { href: "/admin/videos", label: adminCopy.nav.videos },
  { href: "/admin/stills", label: adminCopy.nav.stills },
  {
    href: "/admin/stills/collage",
    label: adminCopy.nav.stillsCollagePublic,
  },
  { href: "/admin/services", label: adminCopy.nav.services },
  { href: "/admin/content", label: adminCopy.nav.content },
  { href: "/admin/leads", label: adminCopy.nav.leads },
  { href: "/admin/integrations", label: adminCopy.nav.integrations },
];

type Props = {
  onNavigate?: () => void;
};

function activeNavHref(pathname: string): string | undefined {
  const matches = NAV.filter((item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
  return matches.sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function AdminSidebar({ onNavigate }: Props) {
  const pathname = usePathname();
  const current = activeNavHref(pathname);

  return (
    <nav
      className="flex flex-col gap-1 p-4 text-right"
      aria-label="ניווט ניהול"
    >
      {NAV.map((item) => {
        const active = current === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
              active
                ? "bg-blue-600/20 text-blue-200"
                : "text-slate-400 hover:bg-blue-950/50 hover:text-slate-100",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
