"use client";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

export interface ServiceTypePickerOption {
  label: string;
  value: string;
}

type Props = {
  id: string;
  label: string;
  placeholder: string;
  options: ServiceTypePickerOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inputClass: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
};

export function ServiceTypePicker({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  required,
  inputClass,
  ariaInvalid,
  ariaDescribedBy,
}: Props) {
  const { dir } = useLanguage();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? "";

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative" dir={dir}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-required={required ? true : undefined}
        aria-invalid={ariaInvalid ? true : undefined}
        aria-describedby={ariaDescribedBy}
        data-required={required ? "true" : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          inputClass,
          "flex w-full cursor-pointer items-center text-start",
          !value && "text-slate-500",
        )}
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedLabel || placeholder}
        </span>
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="select-list-scroll absolute z-30 mt-1 max-h-60 w-full overflow-y-auto overscroll-contain rounded-lg border border-blue-500/30 bg-[#0c1222] py-1 shadow-xl shadow-black/40"
        >
          {options.map((option) => (
            <li key={option.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => selectOption(option.value)}
                className={cn(
                  "w-full px-4 py-2.5 text-start text-base transition-colors",
                  value === option.value
                    ? "bg-blue-600/90 text-white"
                    : "text-slate-300 hover:bg-blue-950/70 hover:text-slate-100",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
