"use client";

import { cn } from "@/lib/utils";

type Props = {
  published: boolean;
  disabled?: boolean;
  onToggle: (published: boolean) => void;
};

export function PublishToggle({ published, disabled, onToggle }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(!published)}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
        published
          ? "bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-700/50"
          : "bg-slate-800/80 text-slate-400 ring-1 ring-slate-600/50",
        disabled && "opacity-50",
      )}
      aria-pressed={published}
    >
      {published ? "Published" : "Hidden"}
    </button>
  );
}
