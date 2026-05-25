"use client";

import { adminBtnSecondary } from "@/components/admin/admin-styles";
import { signOutAdmin } from "@/lib/admin/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/categories": "Video Categories",
  "/admin/videos": "Videos",
  "/admin/stills": "Stills Gallery",
  "/admin/services": "Services",
  "/admin/content": "Site Content",
  "/admin/leads": "Leads",
};

type Props = {
  email?: string;
  onMenuToggle?: () => void;
};

export function AdminHeader({ email, onMenuToggle }: Props) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Admin";
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOutAdmin();
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-900/40 bg-[#0c1222]/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            className="rounded-lg border border-blue-900/50 px-3 py-2 text-sm text-slate-300 lg:hidden"
            onClick={onMenuToggle}
            aria-label="Open menu"
          >
            Menu
          </button>
        )}
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-400/80">
            Lev Ari Admin
          </p>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {email && (
          <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
        )}
        <Link href="/" className={adminBtnSecondary}>
          View site
        </Link>
        <button
          type="button"
          className={adminBtnSecondary}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </header>
  );
}
