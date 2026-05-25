"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { adminCopy } from "@/lib/admin/copy";
import { useState } from "react";

type Props = {
  email?: string;
  children: React.ReactNode;
};

export function AdminShell({ email, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100">
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 transform border-l border-blue-900/40 bg-[#0c1222] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-blue-900/40 px-4 py-5 text-right">
          <p className="font-display text-lg font-semibold text-white">
            {adminCopy.brand.title}
          </p>
          <p className="text-xs text-slate-500">{adminCopy.brand.subtitle}</p>
        </div>
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label={adminCopy.actions.closeMenu}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          email={email}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
