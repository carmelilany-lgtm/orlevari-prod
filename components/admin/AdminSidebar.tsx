"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/categories", label: "Video Categories" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/stills", label: "Stills Gallery" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/integrations", label: "Integrations" },
];

type Props = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="Admin navigation">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

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
