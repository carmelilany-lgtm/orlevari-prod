"use client";

import { cn } from "@/lib/utils";
import type { WorkFilter } from "@/types/works";

interface WorkFiltersProps {
  active: WorkFilter;
  onChange: (filter: WorkFilter) => void;
  labels: Record<WorkFilter, string>;
}

const FILTERS: WorkFilter[] = ["all", "video", "stills"];

export function WorkFilters({ active, onChange, labels }: WorkFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Work filters"
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={active === filter}
          onClick={() => onChange(filter)}
          className={cn(
            "rounded-full px-5 py-2.5 text-base font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
            active === filter
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/35"
              : "border border-blue-500/25 bg-blue-950/30 text-slate-400 hover:border-cyan-400/40 hover:text-slate-200",
          )}
        >
          {labels[filter]}
        </button>
      ))}
    </div>
  );
}
