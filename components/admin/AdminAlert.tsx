"use client";

import { cn } from "@/lib/utils";

type Props = {
  variant: "success" | "error" | "info";
  message: string;
  className?: string;
};

export function AdminAlert({ variant, message, className }: Props) {
  if (!message) return null;

  const styles = {
    success: "border-emerald-800/50 bg-emerald-950/40 text-emerald-200",
    error: "border-red-800/50 bg-red-950/40 text-red-200",
    info: "border-blue-800/50 bg-blue-950/40 text-blue-200",
  };

  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        styles[variant],
        className,
      )}
    >
      {message}
    </p>
  );
}
