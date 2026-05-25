import type { Layout } from "react-grid-layout/legacy";
import {
  buildDefaultGridPositions,
  clampCollageLayoutItem,
  COLLAGE_SIZE_SPANS,
  type CollageLayout,
  type CollageSize,
} from "@/lib/stills/collage-layout";
import type { StillWorkItem } from "@/types/works";

export type GridLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export function stillsToGridLayout(items: StillWorkItem[]): Layout {
  const positions = buildDefaultGridPositions(items);
  return items.map((item) => {
    const layout = positions.get(item.id) ?? clampCollageLayoutItem({
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    });
    return {
      i: item.id,
      x: layout.x ?? 0,
      y: layout.y ?? 0,
      w: layout.w,
      h: layout.h,
      minW: 1,
      minH: 1,
      maxW: 12,
      maxH: 8,
    };
  });
}

export function gridLayoutToCollageLayouts(
  layout: Layout,
): { id: string; collage_layout: CollageLayout }[] {
  return layout.map((item) => ({
    id: item.i,
    collage_layout: clampCollageLayoutItem({
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }),
  }));
}

/** Apply a size preset to one grid item (live collage editor). */
export function applySizeToLayoutItem(
  layout: Layout,
  itemId: string,
  size: CollageSize,
): Layout {
  const spans = COLLAGE_SIZE_SPANS[size];
  return layout.map((item) => {
    if (item.i !== itemId) return item;
    const clamped = clampCollageLayoutItem({
      x: item.x,
      y: item.y,
      w: spans.w,
      h: spans.h,
    });
    return {
      ...item,
      w: clamped.w,
      h: clamped.h,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH,
    };
  });
}
