"use client";

import {
  gridLayoutToCollageLayouts,
  stillsToGridLayout,
} from "@/lib/stills/collage-grid";
import { cn } from "@/lib/utils";
import { stillAlt, type StillWorkItem } from "@/types/works";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import type { Layout } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const GridLayoutWithWidth = dynamic(
  () =>
    import("react-grid-layout/legacy").then((mod) => {
      const { default: GridLayout, WidthProvider } = mod;
      return WidthProvider(GridLayout);
    }),
  { ssr: false, loading: () => <p className="text-sm text-slate-400">…</p> },
);

type Props = {
  items: StillWorkItem[];
  locale: "en" | "he";
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLayoutDraftChange: (layout: Layout) => void;
};

export function StillsCollageLiveEditor({
  items,
  locale,
  selectedId,
  onSelect,
  onLayoutDraftChange,
}: Props) {
  const initialLayout = useMemo(() => stillsToGridLayout(items), [items]);
  const [layout, setLayout] = useState<Layout>(initialLayout);

  const handleLayoutChange = useCallback(
    (next: Layout) => {
      setLayout(next);
      onLayoutDraftChange(next);
    },
    [onLayoutDraftChange],
  );

  return (
    <div className="stills-collage-edit-surface hidden md:block">
      <GridLayoutWithWidth
        className="stills-rgl-layout"
        layout={layout}
        cols={12}
        rowHeight={72}
        margin={[4, 4] as [number, number]}
        containerPadding={[0, 0] as [number, number]}
        isDraggable
        isResizable
        resizeHandles={["se", "e", "s"]}
        compactType="vertical"
        onLayoutChange={handleLayoutChange}
      >
        {items.map((item) => {
          const label = stillAlt(item, locale);
          const selected = selectedId === item.id;
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item.id);
                }
              }}
              className={cn(
                "stills-rgl-item overflow-hidden rounded-sm",
                selected && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070b14]",
              )}
              aria-label={label}
              aria-pressed={selected}
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt={label}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full min-h-[4rem] items-center justify-center bg-slate-800/80 text-xs text-slate-400">
                  {label}
                </div>
              )}
            </div>
          );
        })}
      </GridLayoutWithWidth>
    </div>
  );
}

export function layoutItemsFromDraft(layout: Layout) {
  return gridLayoutToCollageLayouts(layout);
}
