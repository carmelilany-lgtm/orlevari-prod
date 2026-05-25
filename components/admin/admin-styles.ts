import { cn } from "@/lib/utils";

export const adminInputClass = cn(
  "w-full rounded-lg border border-blue-900/50 bg-[#0c1222] px-3 py-2 text-sm text-slate-100",
  "placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
);

export const adminLabelClass = "mb-1 block text-sm font-medium text-slate-300";

export const adminCardClass =
  "rounded-xl border border-blue-900/40 bg-[#0f1729] p-5 shadow-lg shadow-black/20";

export const adminTableClass = "w-full text-left text-sm";

export const adminThClass =
  "border-b border-blue-900/40 px-3 py-2 font-medium text-slate-400";

export const adminTdClass = "border-b border-blue-950/60 px-3 py-3 text-slate-200";

export const adminBtnPrimary =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50";

export const adminBtnSecondary =
  "rounded-lg border border-blue-800/60 bg-blue-950/40 px-4 py-2 text-sm text-slate-200 hover:border-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50";

export const adminBtnDanger =
  "rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-950/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50";
