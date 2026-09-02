"use client";

import { visualEditorCopy } from "@/components/visual-editor/visual-editor-copy";
import { VisualFormatBar } from "@/components/visual-editor/VisualFormatBar";
import { useVisualEditor } from "@/components/visual-editor/VisualEditorProvider";
import { cn } from "@/lib/utils";
import { isLocalVisualEditorDefault } from "@/lib/visual-editor/local-default";
import Link from "next/link";

export function VisualEditorToolbar() {
  const {
    isDirty,
    saving,
    status,
    statusMessage,
    save,
    cancel,
    exitVisualEdit,
  } = useVisualEditor();

  const statusLine =
    status === "saving"
      ? visualEditorCopy.saving
      : status === "saved"
        ? visualEditorCopy.saved
        : status === "error"
          ? statusMessage || visualEditorCopy.saveFailed
          : isDirty
            ? visualEditorCopy.unsaved
            : null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[200] border-b border-blue-500/25 bg-[#0a1020]/95 shadow-lg shadow-black/40 backdrop-blur-md"
      dir="rtl"
      role="region"
      aria-label={visualEditorCopy.modeLabel}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 text-right">
            <p className="text-sm font-semibold text-blue-100">
              {visualEditorCopy.modeLabel}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {visualEditorCopy.languageHint}
            </p>
            {statusLine ? (
              <p
                className={cn(
                  "mt-1 text-xs font-medium",
                  status === "saved" && "text-emerald-400",
                  status === "error" && "text-red-400",
                  status === "saving" && "text-cyan-300",
                  isDirty && status === "idle" && "text-amber-300/90",
                )}
                aria-live="polite"
              >
                {statusLine}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void save()}
              disabled={!isDirty || saving}
            >
              {saving ? visualEditorCopy.saving : visualEditorCopy.save}
            </button>
            <button
              type="button"
              className="rounded-lg border border-blue-700/60 bg-blue-950/50 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50"
              onClick={cancel}
              disabled={!isDirty || saving}
            >
              {visualEditorCopy.cancel}
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-blue-800/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              onClick={(e) => {
                if (isDirty && !window.confirm("יש שינויים שלא נשמרו. לצאת בכל זאת?")) {
                  e.preventDefault();
                }
              }}
            >
              {visualEditorCopy.backToAdmin}
            </Link>
            <button
              type="button"
              className="rounded-lg border border-slate-700/60 px-3 py-2 text-xs text-slate-500 transition hover:text-slate-300"
              onClick={() => {
                if (
                  isDirty &&
                  !window.confirm("יש שינויים שלא נשמרו. לצאת ממצב עריכה בכל זאת?")
                ) {
                  return;
                }
                exitVisualEdit();
              }}
              aria-label="יציאה ממצב עריכה"
            >
              ✕
            </button>
          </div>
        </div>
        {isLocalVisualEditorDefault() ? <VisualFormatBar /> : null}
      </div>
    </div>
  );
}
