"use client";

import { useVisualEditor } from "@/components/visual-editor/VisualEditorProvider";
import {
  isVisualMultilineKey,
  VISUAL_FIELD_LABELS,
  type VisualContentKey,
} from "@/lib/admin/visual-content-keys";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type EditableAs = "h1" | "h2" | "p" | "span" | "div";

type Props = {
  contentKey: VisualContentKey;
  fallback: string;
  as?: EditableAs;
  multiline?: boolean;
  className?: string;
  id?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "children" | "as">;

const editableFieldClass =
  "w-full min-w-0 rounded-md border border-transparent bg-blue-950/20 px-2 py-1 text-inherit transition-[border-color,box-shadow] placeholder:text-slate-500 hover:border-blue-500/40 focus:border-cyan-400/60 focus:bg-blue-950/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/25";

function AutoSizeTextarea({
  value,
  onChange,
  dir,
  className,
  id,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  dir: "ltr" | "rtl";
  className?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      dir={dir}
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={cn(editableFieldClass, "resize-none overflow-hidden", className)}
    />
  );
}

export function EditableText({
  contentKey,
  fallback,
  as: Tag = "span",
  multiline,
  className,
  id,
  ...rest
}: Props) {
  const { isActive, getValue, updateField, locale } = useVisualEditor();
  const { cms } = useLanguage();
  const labelId = useId();
  const isMultiline = multiline ?? isVisualMultilineKey(contentKey);
  const value = isActive
    ? getValue(contentKey, fallback)
    : cms(contentKey, fallback);
  const friendlyLabel = VISUAL_FIELD_LABELS[contentKey];
  const fieldDir = locale === "he" ? "rtl" : "ltr";

  const handlePlainPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const target = e.currentTarget;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const next = value.slice(0, start) + text + value.slice(end);
      updateField(contentKey, next);
    },
    [contentKey, updateField, value],
  );

  if (!isActive) {
    const DisplayTag = Tag as ElementType;
    return (
      <DisplayTag className={className} id={id} {...rest}>
        {value}
      </DisplayTag>
    );
  }

  return (
    <div
      className={cn(
        "group relative rounded-lg ring-1 ring-transparent transition hover:ring-blue-500/30",
        className?.includes("gradient-text") && "block w-full",
      )}
      data-visual-field={contentKey}
    >
      <span
        id={labelId}
        className="pointer-events-none absolute -top-5 right-0 z-10 rounded bg-[#0c1222]/90 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300/90 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {friendlyLabel}
      </span>
      {isMultiline ? (
        <AutoSizeTextarea
          id={id}
          dir={fieldDir}
          value={value}
          onChange={(v) => updateField(contentKey, v)}
          aria-label={friendlyLabel}
          className={cn(editableFieldClass, className)}
        />
      ) : (
        <input
          type="text"
          id={id}
          dir={fieldDir}
          value={value}
          onChange={(e) => updateField(contentKey, e.target.value)}
          onPaste={handlePlainPaste}
          aria-labelledby={labelId}
          aria-label={friendlyLabel}
          className={cn(editableFieldClass, className)}
        />
      )}
    </div>
  );
}
