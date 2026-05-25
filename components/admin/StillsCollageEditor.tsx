"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminBtnDanger,
  adminBtnPrimary,
  adminBtnSecondary,
  adminCardClass,
} from "@/components/admin/admin-styles";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  resetStillsCollageLayout,
  saveStillsCollageLayout,
  type CollageLayoutItem,
} from "@/lib/admin/actions/stills-collage";
import type { StillImageRow } from "@/lib/admin/actions/stills";
import { adminCopy } from "@/lib/admin/copy";
import {
  COLLAGE_SIZE_ORDER,
  layoutFromSize,
  parseCollageLayout,
  sizeFromLayout,
  type CollageSize,
} from "@/lib/stills/collage-layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  initialStills: StillImageRow[];
  publicSiteUrl?: string;
};

type EditorItem = {
  id: string;
  image_url: string;
  sort_order: number;
  size: CollageSize;
};

const sizeLabels: Record<CollageSize, string> = {
  small: adminCopy.collage.sizeSmall,
  medium: adminCopy.collage.sizeMedium,
  wide: adminCopy.collage.sizeWide,
  tall: adminCopy.collage.sizeTall,
  large: adminCopy.collage.sizeLarge,
};

function rowToEditorItem(row: StillImageRow): EditorItem {
  const layout = parseCollageLayout(row.collage_layout);
  return {
    id: row.id,
    image_url: row.image_url,
    sort_order: row.sort_order,
    size: sizeFromLayout(layout),
  };
}

export function StillsCollageEditor({ initialStills, publicSiteUrl }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditorItem[]>(() =>
    [...initialStills]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(rowToEditorItem),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  const previewUrl = useMemo(() => {
    const base = publicSiteUrl?.replace(/\/$/, "") ?? "";
    return base ? `${base}/#works` : "/#works";
  }, [publicSiteUrl]);

  function setSize(id: string, size: CollageSize) {
    setItems((list) =>
      list.map((item) => (item.id === id ? { ...item, size } : item)),
    );
  }

  function moveItem(id: string, direction: -1 | 1) {
    setItems((list) => {
      const idx = list.findIndex((i) => i.id === id);
      if (idx < 0) return list;
      const next = idx + direction;
      if (next < 0 || next >= list.length) return list;
      const copy = [...list];
      const [removed] = copy.splice(idx, 1);
      copy.splice(next, 0, removed);
      return copy;
    });
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    setSuccess("");

    const payload: CollageLayoutItem[] = items.map((item, index) => ({
      id: item.id,
      sort_order: index,
      size: item.size,
    }));

    const result = await saveStillsCollageLayout(payload);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(adminCopy.collage.saved);
    router.refresh();
  }

  async function handleReset() {
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await resetStillsCollageLayout();
    setLoading(false);
    setResetOpen(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setItems((list) =>
      list.map((item) => ({ ...item, size: "small" as CollageSize })),
    );
    setSuccess(adminCopy.collage.resetDone);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-slate-400">{adminCopy.collage.intro}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/stills" className={adminBtnSecondary}>
            {adminCopy.collage.back}
          </Link>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={adminBtnSecondary}
          >
            {adminCopy.collage.preview}
          </a>
          <button
            type="button"
            className={adminBtnDanger}
            onClick={() => setResetOpen(true)}
            disabled={loading || items.length === 0}
          >
            {adminCopy.collage.reset}
          </button>
          <button
            type="button"
            className={adminBtnPrimary}
            onClick={handleSave}
            disabled={loading || items.length === 0}
          >
            {loading ? adminCopy.actions.saving : adminCopy.collage.save}
          </button>
        </div>
      </div>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {items.length === 0 ? (
        <AdminEmptyState
          title={adminCopy.collage.emptyTitle}
          description={adminCopy.collage.emptyDesc}
          action={
            <Link href="/admin/stills" className={adminBtnPrimary}>
              {adminCopy.collage.back}
            </Link>
          }
        />
      ) : (
        <div
          className={`${adminCardClass} grid gap-3 p-4`}
          style={{
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gridAutoRows: "minmax(72px, auto)",
          }}
        >
          {items.map((item, index) => {
            const span = layoutFromSize(item.size);
            return (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-blue-900/50 bg-[#0a1020] p-2"
                style={{
                  gridColumn: `span ${Math.min(span.w, 3)}`,
                  gridRow: `span ${span.h}`,
                }}
              >
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-[#070b14]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-center text-xs text-slate-500">
                  {adminCopy.collage.order}: {index + 1} · {sizeLabels[item.size]}
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {COLLAGE_SIZE_ORDER.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        item.size === size
                          ? "rounded bg-blue-600/30 px-2 py-0.5 text-xs text-blue-200"
                          : "rounded px-2 py-0.5 text-xs text-slate-400 hover:bg-blue-950/50"
                      }
                      onClick={() => setSize(item.id, size)}
                    >
                      {sizeLabels[size]}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    className={adminBtnSecondary}
                    disabled={index === 0}
                    onClick={() => moveItem(item.id, -1)}
                  >
                    {adminCopy.collage.moveUp}
                  </button>
                  <button
                    type="button"
                    className={adminBtnSecondary}
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(item.id, 1)}
                  >
                    {adminCopy.collage.moveDown}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmDialog
        open={resetOpen}
        title={adminCopy.collage.resetTitle}
        message={adminCopy.collage.resetMessage}
        loading={loading}
        confirmLabel={adminCopy.collage.reset}
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}
