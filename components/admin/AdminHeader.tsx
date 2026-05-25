"use client";

import { adminBtnSecondary } from "@/components/admin/admin-styles";
import { signOutAdmin } from "@/lib/admin/actions/auth";
import { adminCopy, adminPageTitles } from "@/lib/admin/copy";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  email?: string;
  publicSiteUrl?: string;
  onMenuToggle?: () => void;
};

export function AdminHeader({ email, publicSiteUrl, onMenuToggle }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const title = adminPageTitles[pathname] ?? adminCopy.brand.defaultPageTitle;
  const [loggingOut, setLoggingOut] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  async function handleCopySiteLink() {
    const url =
      publicSiteUrl?.trim() ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (!url) {
      setCopyState("fail");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("ok");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("fail");
      window.setTimeout(() => setCopyState("idle"), 2500);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const result = await signOutAdmin();
      if (!result.ok) {
        setLoggingOut(false);
        return;
      }
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-900/40 bg-[#0c1222]/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            className="rounded-lg border border-blue-900/50 px-3 py-2 text-sm text-slate-300 lg:hidden"
            onClick={onMenuToggle}
            aria-label={adminCopy.actions.openMenu}
          >
            {adminCopy.actions.menu}
          </button>
        )}
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-blue-400/80">
            {adminCopy.brand.headerBadge}
          </p>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {email && (
          <span
            className="hidden text-sm text-slate-500 sm:inline"
            dir="ltr"
          >
            {email}
          </span>
        )}
        {publicSiteUrl && (
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={handleCopySiteLink}
            aria-live="polite"
          >
            {copyState === "ok"
              ? adminCopy.actions.linkCopied
              : copyState === "fail"
                ? adminCopy.actions.copyLinkFailed
                : adminCopy.actions.copySiteLink}
          </button>
        )}
        <Link href="/" className={adminBtnSecondary} target="_blank" rel="noopener noreferrer">
          {adminCopy.actions.viewSite}
        </Link>
        <button
          type="button"
          className={adminBtnSecondary}
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? adminCopy.actions.signingOut : adminCopy.actions.logout}
        </button>
      </div>
    </header>
  );
}
