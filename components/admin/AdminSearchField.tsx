"use client";

import { adminCopy } from "@/lib/admin/copy";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AdminSearchField({
  value,
  onChange,
  placeholder = adminCopy.search.placeholder,
  className = "",
}: Props) {
  return (
    <label className={`block max-w-md text-right ${className}`}>
      <span className="sr-only">{adminCopy.search.label}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir="rtl"
        className="w-full rounded-lg border border-blue-900/50 bg-[#0a1220] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400"
      />
    </label>
  );
}
