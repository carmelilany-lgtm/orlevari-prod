"use client";

import {
  A11Y_TRIGGER_ID,
  A11Y_WIDGET_ID,
  cycleContrast,
  cycleLineSpacing,
  cycleTextSize,
} from "@/lib/a11y/prefs";
import {
  getA11yPrefsServerSnapshot,
  getA11yPrefsSnapshot,
  patchA11yPrefs,
  resetA11yPrefs,
  subscribeA11yPrefs,
} from "@/lib/a11y/store";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <circle cx="12" cy="4" r="2" />
      <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.51 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z" />
    </svg>
  );
}

export function AccessibilityWidget({
  panelAlign = "end",
}: {
  panelAlign?: "start" | "end";
}) {
  const { t, dir, locale } = useLanguage();
  const copy = t.a11y;
  const prefs = useSyncExternalStore(
    subscribeA11yPrefs,
    getA11yPrefsSnapshot,
    getA11yPrefsServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const root = document.getElementById("a11y-widget-root");
      const panel = document.getElementById(A11Y_WIDGET_ID);
      if (root?.contains(target) || panel?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code === "KeyA" && event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const items = [...focusable];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 16);
      const maxHeight = Math.min(window.innerHeight - 24, 480);
      let left =
        panelAlign === "end" ? rect.right - width : rect.left;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      let top = rect.bottom + 10;
      if (top + 160 > window.innerHeight) {
        top = Math.max(8, rect.top - 10 - Math.min(panel.offsetHeight, maxHeight));
      }
      panel.style.width = `${width}px`;
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.maxHeight = `${maxHeight}px`;
    }

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, panelAlign, prefs.textSize, prefs.lineSpacing, dir]);

  const contrastLabel =
    prefs.contrast === "high"
      ? copy.contrastHigh
      : prefs.contrast === "invert"
        ? copy.contrastInvert
        : copy.contrastOff;
  const spacingLabel =
    prefs.lineSpacing === "relaxed"
      ? copy.spacingRelaxed
      : prefs.lineSpacing === "loose"
        ? copy.spacingLoose
        : copy.spacingNormal;

  return (
    <div
      id="a11y-widget-root"
      className="relative shrink-0"
      dir={dir}
      lang={locale}
    >
      <button
        ref={triggerRef}
        type="button"
        id={A11Y_TRIGGER_ID}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-200 hover:text-zinc-300",
          open && "text-white",
        )}
        aria-label={copy.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={A11Y_WIDGET_ID}
        aria-keyshortcuts="Alt+A"
        onClick={() => setOpen((value) => !value)}
      >
        <AccessibilityIcon />
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              id={A11Y_WIDGET_ID}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              dir={dir}
              lang={locale}
              className="fixed z-[80] overflow-y-auto rounded-2xl border border-blue-500/25 bg-[#0a1020]/95 p-3.5 shadow-2xl shadow-black/50 backdrop-blur-md"
            >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id={titleId} className="text-base font-semibold text-white">
                {copy.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {copy.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:text-white"
              onClick={close}
            >
              {copy.close}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              label={copy.textSize}
              value={`${prefs.textSize}%`}
              onClick={() => patchA11yPrefs({ textSize: cycleTextSize(prefs.textSize) })}
            />
            <ToggleButton
              label={copy.contrast}
              value={contrastLabel}
              onClick={() => patchA11yPrefs({ contrast: cycleContrast(prefs.contrast) })}
            />
            <ToggleButton
              label={copy.spacing}
              value={spacingLabel}
              onClick={() =>
                patchA11yPrefs({ lineSpacing: cycleLineSpacing(prefs.lineSpacing) })
              }
            />
            <ToggleButton
              label={copy.highlightLinks}
              value={prefs.highlightLinks ? copy.on : copy.off}
              pressed={prefs.highlightLinks}
              onClick={() =>
                patchA11yPrefs({ highlightLinks: !prefs.highlightLinks })
              }
            />
            <ToggleButton
              label={copy.readableFont}
              value={prefs.readableFont ? copy.on : copy.off}
              pressed={prefs.readableFont}
              onClick={() => patchA11yPrefs({ readableFont: !prefs.readableFont })}
            />
            <ToggleButton
              label={copy.reduceMotion}
              value={prefs.reduceMotion ? copy.on : copy.off}
              pressed={prefs.reduceMotion}
              onClick={() => patchA11yPrefs({ reduceMotion: !prefs.reduceMotion })}
            />
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-blue-800/50 py-2.5 text-sm text-slate-200 transition hover:border-cyan-500/40 hover:text-white"
            onClick={() => resetA11yPrefs()}
          >
            {copy.reset}
          </button>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <Link
              href="/accessibility-statement"
              className="text-cyan-300/90 underline-offset-2 hover:underline"
            >
              {copy.statement}
            </Link>
            <Link
              href="/#contact"
              className="text-cyan-300/90 underline-offset-2 hover:underline"
            >
              {copy.contact}
            </Link>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              {copy.shortcutHint}
            </p>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function ToggleButton({
  label,
  value,
  pressed,
  onClick,
}: {
  label: string;
  value: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      aria-pressed={pressed}
      className={cn(
        "rounded-xl border border-blue-800/50 bg-[#080d18] px-3 py-2.5 text-start transition hover:border-cyan-500/40",
        pressed && "border-cyan-400/50 bg-cyan-950/40",
      )}
    >
      <span className="block text-[11px] text-slate-400">{label}</span>
      <span className="mt-0.5 block text-sm font-medium text-white">{value}</span>
    </button>
  );
}
