"use client";

import { visualEditorCopy } from "@/components/visual-editor/visual-editor-copy";
import { useVisualEditor } from "@/components/visual-editor/VisualEditorProvider";
import { VISUAL_FIELD_LABELS } from "@/lib/admin/visual-content-keys";
import {
  effectiveFontSize,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_PRESETS,
  hasVisualFieldStyle,
} from "@/lib/visual-editor/field-styles";
import { cn } from "@/lib/utils";

const controlClass =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-blue-800/60 bg-blue-950/70 px-2 text-sm text-slate-100 transition hover:border-cyan-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

export function VisualFormatBar() {
  const {
    focusedKey,
    getFieldStyle,
    bumpFontSize,
    setFontSize,
    updateFieldStyle,
    resetFieldStyle,
    save,
    isDirty,
    saving,
  } = useVisualEditor();

  const style = focusedKey ? getFieldStyle(focusedKey) : undefined;
  const size = focusedKey ? effectiveFontSize(focusedKey, style) : 16;
  const disabled = !focusedKey;
  const presetValues = new Set<number>(FONT_SIZE_PRESETS);
  const sizeOptions = presetValues.has(size)
    ? FONT_SIZE_PRESETS
    : [...FONT_SIZE_PRESETS, size].sort((a, b) => a - b);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        className="flex flex-wrap items-center gap-2"
        onMouseDown={(e) => e.preventDefault()}
      >
      <span className="text-[11px] text-slate-500">
        {focusedKey
          ? `${visualEditorCopy.formatField}: ${VISUAL_FIELD_LABELS[focusedKey]}`
          : visualEditorCopy.formatHint}
      </span>
      <div className="flex items-center gap-1 rounded-lg border border-blue-800/50 bg-[#080d18] p-0.5">
        <button
          type="button"
          className={controlClass}
          disabled={disabled || size <= FONT_SIZE_MIN}
          onClick={() => focusedKey && bumpFontSize(focusedKey, -1)}
          aria-label={visualEditorCopy.decreaseSize}
        >
          −
        </button>
        <label className="sr-only" htmlFor="visual-font-size">
          {visualEditorCopy.fontSize}
        </label>
        <select
          id="visual-font-size"
          className="h-8 w-[4.25rem] rounded-md border-0 bg-transparent text-center text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 disabled:opacity-40"
          disabled={disabled}
          value={size}
          onChange={(e) =>
            focusedKey && setFontSize(focusedKey, Number(e.target.value))
          }
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={controlClass}
          disabled={disabled || size >= FONT_SIZE_MAX}
          onClick={() => focusedKey && bumpFontSize(focusedKey, 1)}
          aria-label={visualEditorCopy.increaseSize}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={cn(controlClass, "font-bold", style?.bold && "border-cyan-400/70 bg-cyan-950/50")}
        disabled={disabled}
        aria-pressed={Boolean(style?.bold)}
        onClick={() => focusedKey && updateFieldStyle(focusedKey, { bold: !style?.bold })}
      >
        B
      </button>
      <button
        type="button"
        className={cn(controlClass, "italic", style?.italic && "border-cyan-400/70 bg-cyan-950/50")}
        disabled={disabled}
        aria-pressed={Boolean(style?.italic)}
        onClick={() =>
          focusedKey && updateFieldStyle(focusedKey, { italic: !style?.italic })
        }
      >
        I
      </button>
      <button
        type="button"
        className={cn(controlClass, "px-2.5 text-xs")}
        disabled={disabled || !hasVisualFieldStyle(style)}
        onClick={() => focusedKey && resetFieldStyle(focusedKey)}
      >
        {visualEditorCopy.resetStyle}
      </button>
      </div>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => void save()}
        disabled={!isDirty || saving}
      >
        {saving ? visualEditorCopy.saving : visualEditorCopy.save}
      </button>
    </div>
  );
}
