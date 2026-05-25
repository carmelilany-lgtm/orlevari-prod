"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-blue-900/40 bg-[#0c1222] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-blue-900/40 px-4 py-5">
          <p className="font-display text-lg font-semibold text-white">
            Lev Ari
          </p>
          <p className="text-xs text-slate-500">Content management</p>
        </div>
        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close menu"
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
