"use client";

import { adminBtnDanger, adminBtnSecondary } from "@/components/admin/admin-styles";
import { adminCopy } from "@/lib/admin/copy";
import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmDialog({
  open,
  title,
  message,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-blue-900/50 bg-[#0f1729] p-6 text-right shadow-xl">
        <h2 id="delete-dialog-title" className="text-lg font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-start gap-3">
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={onCancel}
            disabled={loading}
          >
            {adminCopy.actions.cancel}
          </button>
          <button
            type="button"
            className={adminBtnDanger}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? adminCopy.actions.deleting : adminCopy.actions.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
