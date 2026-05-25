"use client";

import { StillsLightboxPlaceholder } from "@/components/works/StillsLightboxPlaceholder";
import { StillsCollageLiveEditor } from "@/components/works/StillsCollageLiveEditor";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { usePublicAdmin } from "@/hooks/use-public-admin";
import {
  resetStillsCollageLayout,
  saveStillsLiveCollageLayout,
} from "@/lib/admin/actions/stills-collage";
import { useLanguage } from "@/lib/i18n/context";
import { stillsToGridLayout } from "@/lib/stills/collage-grid";
import {
  collageSpansForViewport,
  hasCustomCollageLayout,
  hasPositionalCollageLayout,
  parseCollageLayout,
} from "@/lib/stills/collage-layout";
import { cn } from "@/lib/utils";
import {
  stillAlt,
  stillAspectRatio,
  type StillWorkItem,
} from "@/types/works";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Layout } from "react-grid-layout/legacy";

/** Spread aspect ratios so column heads are not all the same shape */
function interleaveForMasonry(items: StillWorkItem[]): StillWorkItem[] {
  const portrait: StillWorkItem[] = [];
  const landscape: StillWorkItem[] = [];
  const square: StillWorkItem[] = [];
  const wide: StillWorkItem[] = [];

  for (const item of items) {
    const ratio = stillAspectRatio(item) ?? 1;
    if (ratio > 1.55) wide.push(item);
    else if (ratio > 1.12) landscape.push(item);
    else if (ratio < 0.88) portrait.push(item);
    else square.push(item);
  }

  const buckets = [wide, landscape, portrait, square];
  const result: StillWorkItem[] = [];
  while (result.length < items.length) {
    for (const bucket of buckets) {
      const next = bucket.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

const variantOverlays = [
  "from-blue-900/55 via-slate-900/70 to-[#070b14]",
  "from-indigo-900/50 via-blue-950/75 to-[#050a14]",
  "from-cyan-900/35 via-slate-900/70 to-[#0a1020]",
  "from-sky-900/45 via-slate-950/75 to-[#070b14]",
  "from-blue-800/40 via-slate-800/65 to-[#060c18]",
  "from-teal-900/30 via-blue-950/80 to-[#050a12]",
  "from-violet-900/40 via-slate-900/72 to-[#080e1a]",
  "from-slate-800/50 via-blue-900/60 to-[#050810]",
  "from-cyan-800/35 via-indigo-950/70 to-[#0a1220]",
  "from-blue-950/60 via-slate-900/75 to-[#040810]",
  "from-indigo-800/45 via-slate-950/68 to-[#070c16]",
  "from-sky-950/50 via-blue-900/65 to-[#060a14]",
];

function StillTile({
  item,
  locale,
  openLabel,
  onSelect,
  collageTile = false,
  positionalTile = false,
  colSpan = 1,
  rowSpan = 1,
  gridPosition,
  editMode = false,
  selected = false,
}: {
  item: StillWorkItem;
  locale: "en" | "he";
  openLabel: string;
  onSelect: (item: StillWorkItem) => void;
  collageTile?: boolean;
  positionalTile?: boolean;
  colSpan?: number;
  rowSpan?: number;
  gridPosition?: { x: number; y: number; w: number; h: number };
  editMode?: boolean;
  selected?: boolean;
}) {
  const variant = item.variant ?? 0;
  const gradient = variantOverlays[variant % variantOverlays.length];
  const label = stillAlt(item, locale);
  const ratio = stillAspectRatio(item);
  const aspectStyle =
    item.width && item.height
      ? { aspectRatio: `${item.width} / ${item.height}` }
      : ratio
        ? { aspectRatio: ratio }
        : { aspectRatio: "4 / 3" };

  const spanStyle = collageTile
    ? ({
        ["--col-span" as string]: colSpan,
        ["--row-span" as string]: rowSpan,
      } as React.CSSProperties)
    : undefined;

  const positionStyle = positionalTile && gridPosition
    ? {
        gridColumn: `${gridPosition.x + 1} / span ${gridPosition.w}`,
        gridRow: `${gridPosition.y + 1} / span ${gridPosition.h}`,
      }
    : undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${openLabel}: ${label}`}
      aria-pressed={editMode ? selected : undefined}
      style={{ ...spanStyle, ...positionStyle }}
      className={cn(
        "still-mosaic-item group cursor-pointer",
        collageTile && "stills-collage-tile h-full min-h-0",
        positionalTile && "stills-collage-positional-tile",
        editMode && selected && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070b14]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan-400",
      )}
    >
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- Supabase uploads, lazy + async decode
        <img
          src={item.image_url}
          alt={label}
          width={item.width}
          height={item.height}
          loading="lazy"
          decoding="async"
          className="still-mosaic-image"
        />
      ) : (
        <div
          className={cn(
            "still-placeholder relative block w-full bg-gradient-to-br",
            gradient,
            collageTile && "h-full min-h-[5rem]",
          )}
          style={aspectStyle}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
            style={{
              backgroundImage: `radial-gradient(circle at ${25 + (variant % 4) * 15}% ${15 + (variant % 3) * 25}%, rgba(56,189,248,0.18), transparent 50%)`,
            }}
          />
        </div>
      )}
    </button>
  );
}

function sortLayoutForSave(layout: Layout): Layout {
  return [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
}

export function StillsMasonryGallery() {
  const { locale, t } = useLanguage();
  const { stills } = useSiteData();
  const { isAdmin, loading: adminLoading } = usePublicAdmin();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editModeActive, setEditModeActive] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftLayout, setDraftLayout] = useState<Layout | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sortedStills = useMemo(() => {
    return stills
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [stills]);

  const useCollageLayout = useMemo(
    () => hasCustomCollageLayout(sortedStills),
    [sortedStills],
  );

  const usePositionalLayout = useMemo(
    () => hasPositionalCollageLayout(sortedStills),
    [sortedStills],
  );

  const visibleStills = useMemo(() => {
    if (useCollageLayout) return sortedStills;
    return interleaveForMasonry(sortedStills);
  }, [sortedStills, useCollageLayout]);

  const editFromQuery =
    searchParams.get("editCollage") === "1" ||
    searchParams.get("editCollage") === "true";

  const visualEditFromQuery =
    searchParams.get("visualEdit") === "1" ||
    searchParams.get("visualEdit") === "true";

  const collageCopy = t.works.collage;

  const editMode =
    editModeActive ||
    (!adminLoading &&
      isAdmin &&
      editFromQuery &&
      !visualEditFromQuery &&
      sortedStills.length > 0);

  const layoutDraft =
    draftLayout ?? (editMode ? stillsToGridLayout(sortedStills) : null);

  const exitEditMode = useCallback(() => {
    setEditModeActive(false);
    setSelectedId(null);
    setDraftLayout(null);
    setMessage("");
    setError("");
    if (editFromQuery) {
      const url = new URL(window.location.href);
      url.searchParams.delete("editCollage");
      router.replace(`${url.pathname}${url.hash || ""}`, { scroll: false });
    }
  }, [editFromQuery, router]);

  const openLightbox = (item: StillWorkItem) => {
    if (editMode) {
      setSelectedId(item.id);
      return;
    }
    const idx = visibleStills.findIndex((s) => s.id === item.id);
    if (idx >= 0 && item.image_url) setActiveIndex(idx);
  };

  const handleSaveLayout = async () => {
    if (!layoutDraft?.length) return;
    setSaving(true);
    setError("");
    setMessage("");
    const ordered = sortLayoutForSave(layoutDraft);
    const payload = ordered.map((item, index) => ({
      id: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      sort_order: index,
    }));
    const result = await saveStillsLiveCollageLayout(payload);
    setSaving(false);
    if (!result.success) {
      setError(collageCopy.collageSaveFailed);
      return;
    }
    setMessage(collageCopy.collageSaved);
    setEditModeActive(false);
    setDraftLayout(null);
    router.refresh();
  };

  const handleResetLayout = async () => {
    setSaving(true);
    setError("");
    const result = await resetStillsCollageLayout();
    setSaving(false);
    setResetOpen(false);
    if (!result.success) {
      setError(collageCopy.collageSaveFailed);
      return;
    }
    setMessage(collageCopy.collageResetDone);
    setEditModeActive(false);
    setDraftLayout(null);
    router.refresh();
  };

  const startEditMode = () => {
    setDraftLayout(stillsToGridLayout(sortedStills));
    setEditModeActive(true);
  };

  return (
    <div aria-label={t.works.stillsSectionLabel}>
      {isAdmin &&
        !adminLoading &&
        sortedStills.length > 0 &&
        !editMode &&
        !visualEditFromQuery && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            onClick={startEditMode}
          >
            {collageCopy.editCollage}
          </button>
        </div>
      )}

      {editMode && (
        <div
          className="mb-4 space-y-3 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-4"
          role="region"
          aria-label={collageCopy.modeLabel}
        >
          <p className="text-sm font-semibold text-cyan-100">{collageCopy.modeLabel}</p>
          <p className="text-xs text-slate-400">{collageCopy.hint}</p>
          <p className="text-xs text-amber-200/90 md:hidden">{collageCopy.mobileWarning}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
              disabled={saving || !layoutDraft?.length}
              onClick={() => void handleSaveLayout()}
            >
              {saving ? collageCopy.saving : collageCopy.save}
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              disabled={saving}
              onClick={exitEditMode}
            >
              {collageCopy.cancel}
            </button>
            <button
              type="button"
              className="rounded-lg border border-red-800/60 px-4 py-2 text-sm text-red-200 hover:bg-red-950/40"
              disabled={saving}
              onClick={() => setResetOpen(true)}
            >
              {collageCopy.reset}
            </button>
          </div>
          {message && (
            <p className="text-sm text-emerald-400" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          {resetOpen && (
            <div
              className="rounded-lg border border-slate-700 bg-slate-950/80 p-4"
              role="dialog"
              aria-labelledby="collage-reset-title"
            >
              <p id="collage-reset-title" className="text-sm text-slate-200">
                {collageCopy.resetConfirm}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-sm text-white"
                  disabled={saving}
                  onClick={() => void handleResetLayout()}
                >
                  {collageCopy.reset}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300"
                  onClick={() => setResetOpen(false)}
                >
                  {collageCopy.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {editMode ? (
        <>
          <p className="mb-3 text-center text-sm text-amber-200/90 md:hidden">
            {collageCopy.mobileWarning}
          </p>
          <StillsCollageLiveEditor
            key={sortedStills.map((s) => s.id).join("-")}
            items={sortedStills}
            locale={locale}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onLayoutDraftChange={setDraftLayout}
          />
          <div className="masonry-columns md:hidden opacity-60 pointer-events-none">
            {sortedStills.map((item) => (
              <StillTile
                key={item.id}
                item={item}
                locale={locale}
                openLabel={t.works.openStill}
                onSelect={openLightbox}
                editMode
              />
            ))}
          </div>
        </>
      ) : useCollageLayout && usePositionalLayout ? (
        <>
          <div className="stills-collage-grid-positional hidden md:grid">
            {sortedStills.map((item) => {
              const layout = parseCollageLayout(item.collage_layout);
              if (!layout || layout.x == null || layout.y == null) return null;
              return (
                <StillTile
                  key={item.id}
                  item={item}
                  locale={locale}
                  openLabel={t.works.openStill}
                  onSelect={openLightbox}
                  positionalTile
                  gridPosition={{
                    x: layout.x,
                    y: layout.y,
                    w: layout.w,
                    h: layout.h,
                  }}
                />
              );
            })}
          </div>
          <div className="masonry-columns md:hidden">
            {sortedStills.map((item) => (
              <StillTile
                key={item.id}
                item={item}
                locale={locale}
                openLabel={t.works.openStill}
                onSelect={openLightbox}
              />
            ))}
          </div>
        </>
      ) : useCollageLayout ? (
        <>
          <div className="stills-collage-grid hidden md:grid">
            {sortedStills.map((item) => {
              const desktop = collageSpansForViewport(
                item.collage_layout,
                "desktop",
              );
              return (
                <StillTile
                  key={item.id}
                  item={item}
                  locale={locale}
                  openLabel={t.works.openStill}
                  onSelect={openLightbox}
                  collageTile
                  colSpan={desktop.col}
                  rowSpan={desktop.row}
                />
              );
            })}
          </div>
          <div className="masonry-columns md:hidden">
            {sortedStills.map((item) => (
              <StillTile
                key={item.id}
                item={item}
                locale={locale}
                openLabel={t.works.openStill}
                onSelect={openLightbox}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="masonry-columns">
          {visibleStills.map((item) => (
            <StillTile
              key={item.id}
              item={item}
              locale={locale}
              openLabel={t.works.openStill}
              onSelect={openLightbox}
            />
          ))}
        </div>
      )}

      {!editMode && (
        <StillsLightboxPlaceholder
          open={activeIndex !== null}
          images={useCollageLayout ? sortedStills : visibleStills}
          index={activeIndex ?? 0}
          locale={locale}
          closeLabel={t.works.close}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      )}
    </div>
  );
}
