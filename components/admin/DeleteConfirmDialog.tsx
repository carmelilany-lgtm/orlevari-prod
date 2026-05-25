"use client";

import { adminBtnDanger, adminBtnSecondary } from "@/components/admin/admin-styles";

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
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-md rounded-xl border border-blue-900/50 bg-[#0f1729] p-6 shadow-xl">
        <h2 id="delete-dialog-title" className="text-lg font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={adminBtnDanger}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
