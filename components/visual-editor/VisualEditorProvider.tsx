"use client";

import { saveVisualContentUpdates } from "@/lib/admin/actions/visual-content";
import type { VisualContentKey } from "@/lib/admin/visual-content-keys";
import { getCmsRawValue, resolveCmsSetting } from "@/lib/i18n/cms";
import { useLanguage } from "@/lib/i18n/context";
import {
  clampFontSize,
  DEFAULT_FIELD_FONT_SIZE,
  FONT_SIZE_STEP,
  parseVisualFieldStyles,
  stringifyVisualFieldStyles,
  stylesMapsEqual,
  VISUAL_FIELD_STYLES_CONTENT_KEY,
  type VisualFieldStyle,
  type VisualFieldStylesMap,
} from "@/lib/visual-editor/field-styles";
import type { SiteContentKey } from "@/types/content";
import type { Locale } from "@/types/i18n";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type DraftByLocale = Partial<Record<Locale, string>>;

type VisualEditorContextValue = {
  isActive: boolean;
  locale: Locale;
  dir: "ltr" | "rtl";
  isDirty: boolean;
  saving: boolean;
  status: "idle" | "unsaved" | "saving" | "saved" | "error";
  statusMessage: string;
  focusedKey: VisualContentKey | null;
  setFocusedField: (key: VisualContentKey | null) => void;
  getValue: (key: VisualContentKey, fallback: string) => string;
  updateField: (key: VisualContentKey, value: string) => void;
  getFieldStyle: (key: VisualContentKey) => VisualFieldStyle | undefined;
  updateFieldStyle: (key: VisualContentKey, patch: Partial<VisualFieldStyle>) => void;
  bumpFontSize: (key: VisualContentKey, direction: 1 | -1) => void;
  setFontSize: (key: VisualContentKey, size: number) => void;
  resetFieldStyle: (key: VisualContentKey) => void;
  save: () => Promise<void>;
  cancel: () => void;
  exitVisualEdit: () => void;
};

const VisualEditorContext = createContext<VisualEditorContextValue | null>(null);

function baselineFromCms(
  cmsMap: ReturnType<typeof useLanguage>["cmsMap"],
  key: SiteContentKey,
  locale: Locale,
  fallback: string,
): string {
  return getCmsRawValue(cmsMap, key, locale) ?? fallback;
}

function stylesFromCms(
  cmsMap: ReturnType<typeof useLanguage>["cmsMap"],
): VisualFieldStylesMap {
  return parseVisualFieldStyles(
    resolveCmsSetting(cmsMap, VISUAL_FIELD_STYLES_CONTENT_KEY, ""),
  );
}

const inactiveEditor: VisualEditorContextValue = {
  isActive: false,
  locale: "en",
  dir: "ltr",
  isDirty: false,
  saving: false,
  status: "idle",
  statusMessage: "",
  focusedKey: null,
  setFocusedField: () => {},
  getValue: (_key, fallback) => fallback,
  updateField: () => {},
  getFieldStyle: () => undefined,
  updateFieldStyle: () => {},
  bumpFontSize: () => {},
  setFontSize: () => {},
  resetFieldStyle: () => {},
  save: async () => {},
  cancel: () => {},
  exitVisualEdit: () => {},
};

export function VisualEditorProvider({
  children,
  isActive,
  onExit,
}: {
  children: ReactNode;
  isActive: boolean;
  onExit: () => void;
}) {
  const { locale, dir, cmsMap } = useLanguage();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Partial<Record<VisualContentKey, DraftByLocale>>>(
    {},
  );
  const [baselines, setBaselines] = useState<
    Partial<Record<VisualContentKey, DraftByLocale>>
  >({});
  const cmsStyles = useMemo(() => stylesFromCms(cmsMap), [cmsMap]);
  const [styleDraft, setStyleDraft] = useState<VisualFieldStylesMap | null>(null);
  const [styleBaseline, setStyleBaseline] = useState<VisualFieldStylesMap | null>(null);
  const [focusedKey, setFocusedKey] = useState<VisualContentKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<VisualEditorContextValue["status"]>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const fieldStyles = styleDraft ?? cmsStyles;

  const getValue = useCallback(
    (key: VisualContentKey, fallback: string) => {
      const draft = drafts[key]?.[locale];
      if (draft !== undefined) return draft;
      return baselineFromCms(cmsMap, key, locale, fallback);
    },
    [drafts, cmsMap, locale],
  );

  const updateField = useCallback(
    (key: VisualContentKey, value: string) => {
      setBaselines((prev) => {
        if (prev[key]?.[locale] !== undefined) return prev;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [locale]: getCmsRawValue(cmsMap, key, locale) ?? "",
          },
        };
      });
      setDrafts((prev) => ({
        ...prev,
        [key]: { ...prev[key], [locale]: value },
      }));
      setStatus("unsaved");
      setStatusMessage("");
    },
    [locale, cmsMap],
  );

  const getFieldStyle = useCallback(
    (key: VisualContentKey) => fieldStyles[key],
    [fieldStyles],
  );

  const ensureStyleBaseline = useCallback(() => {
    setStyleBaseline((prev) => prev ?? cmsStyles);
  }, [cmsStyles]);

  const commitStyleDraft = useCallback(
    (next: VisualFieldStylesMap) => {
      ensureStyleBaseline();
      setStyleDraft(next);
      setStatus("unsaved");
      setStatusMessage("");
    },
    [ensureStyleBaseline],
  );

  const updateFieldStyle = useCallback(
    (key: VisualContentKey, patch: Partial<VisualFieldStyle>) => {
      const current = { ...(fieldStyles[key] ?? {}) };
      if (patch.fontSize !== undefined) current.fontSize = clampFontSize(patch.fontSize);
      if (patch.bold !== undefined) {
        if (patch.bold) current.bold = true;
        else delete current.bold;
      }
      if (patch.italic !== undefined) {
        if (patch.italic) current.italic = true;
        else delete current.italic;
      }
      const next = { ...fieldStyles };
      if (!current.fontSize && !current.bold && !current.italic) {
        delete next[key];
      } else {
        next[key] = current;
      }
      commitStyleDraft(next);
    },
    [fieldStyles, commitStyleDraft],
  );

  const setFontSize = useCallback(
    (key: VisualContentKey, size: number) => {
      updateFieldStyle(key, { fontSize: size });
    },
    [updateFieldStyle],
  );

  const bumpFontSize = useCallback(
    (key: VisualContentKey, direction: 1 | -1) => {
      const current = fieldStyles[key]?.fontSize;
      const base = current ?? DEFAULT_FIELD_FONT_SIZE[key];
      const next = clampFontSize(base + direction * FONT_SIZE_STEP);
      updateFieldStyle(key, { fontSize: next });
    },
    [fieldStyles, updateFieldStyle],
  );

  const resetFieldStyle = useCallback(
    (key: VisualContentKey) => {
      if (!fieldStyles[key]) return;
      const next = { ...fieldStyles };
      delete next[key];
      commitStyleDraft(next);
    },
    [fieldStyles, commitStyleDraft],
  );

  const dirtyUpdates = useMemo(() => {
    const updates: { key: VisualContentKey; language: Locale; value: string }[] = [];
    for (const key of Object.keys(drafts) as VisualContentKey[]) {
      const draftLocale = drafts[key]?.[locale];
      if (draftLocale === undefined) continue;
      const baseline =
        baselines[key]?.[locale] ?? getCmsRawValue(cmsMap, key, locale) ?? "";
      if (draftLocale !== baseline) {
        updates.push({ key, language: locale, value: draftLocale });
      }
    }
    return updates;
  }, [drafts, baselines, cmsMap, locale]);

  const stylesDirty = Boolean(
    styleDraft &&
      styleBaseline &&
      !stylesMapsEqual(styleDraft, styleBaseline),
  );

  const isDirty = dirtyUpdates.length > 0 || stylesDirty;

  useEffect(() => {
    if (!isActive || !isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isActive, isDirty]);

  const cancel = useCallback(() => {
    setDrafts({});
    setBaselines({});
    setStyleDraft(null);
    setStyleBaseline(null);
    setStatus("idle");
    setStatusMessage("");
  }, []);

  const save = useCallback(async () => {
    if (!dirtyUpdates.length && !stylesDirty) return;
    setSaving(true);
    setStatus("saving");
    setStatusMessage("");
    const result = await saveVisualContentUpdates(
      dirtyUpdates,
      stylesDirty ? stringifyVisualFieldStyles(styleDraft ?? {}) : undefined,
    );
    setSaving(false);
    if (!result.success) {
      setStatus("error");
      setStatusMessage(result.error);
      return;
    }
    setDrafts({});
    setBaselines({});
    setStyleDraft(null);
    setStyleBaseline(null);
    setStatus("saved");
    router.refresh();
  }, [dirtyUpdates, stylesDirty, styleDraft, router]);

  const exitVisualEdit = useCallback(() => {
    onExit();
  }, [onExit]);

  const value = useMemo<VisualEditorContextValue>(
    () => ({
      isActive,
      locale,
      dir,
      isDirty,
      saving,
      status: saving ? "saving" : status,
      statusMessage,
      focusedKey,
      setFocusedField: setFocusedKey,
      getValue,
      updateField,
      getFieldStyle,
      updateFieldStyle,
      bumpFontSize,
      setFontSize,
      resetFieldStyle,
      save,
      cancel,
      exitVisualEdit,
    }),
    [
      isActive,
      locale,
      dir,
      isDirty,
      saving,
      status,
      statusMessage,
      focusedKey,
      getValue,
      updateField,
      getFieldStyle,
      updateFieldStyle,
      bumpFontSize,
      setFontSize,
      resetFieldStyle,
      save,
      cancel,
      exitVisualEdit,
    ],
  );

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const ctx = useContext(VisualEditorContext);
  return ctx ?? inactiveEditor;
}

export function useVisualEditorActive() {
  return useVisualEditor().isActive;
}
