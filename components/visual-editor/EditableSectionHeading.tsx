"use client";

import { EditableText } from "@/components/visual-editor/EditableText";
import type { VisualContentKey } from "@/lib/admin/visual-content-keys";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  titleKey: VisualContentKey;
  titleFallback: string;
  subtitleKey?: VisualContentKey;
  subtitleFallback?: string;
  className?: string;
};

export function EditableSectionHeading({
  id,
  titleKey,
  titleFallback,
  subtitleKey,
  subtitleFallback,
  className,
}: Props) {
  return (
    <header className={cn("mb-12 max-w-2xl", className)}>
      <EditableText
        as="h2"
        id={id}
        contentKey={titleKey}
        fallback={titleFallback}
        className="font-display text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.5rem]"
      />
      {subtitleKey && subtitleFallback !== undefined ? (
        <EditableText
          as="p"
          contentKey={subtitleKey}
          fallback={subtitleFallback}
          className="mt-4 text-lg font-light leading-relaxed text-slate-400 sm:text-xl"
        />
      ) : null}
    </header>
  );
}
