"use client";

import { saveVisualContentUpdates } from "@/lib/admin/actions/visual-content";
import type { VisualContentKey } from "@/lib/admin/visual-content-keys";
import { getCmsRawValue } from "@/lib/i18n/cms";
import { useLanguage } from "@/lib/i18n/context";
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
  getValue: (key: VisualContentKey, fallback: string) => string;
  updateField: (key: VisualContentKey, value: string) => void;
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
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<VisualEditorContextValue["status"]>("idle");
  const [statusMessage, setStatusMessage] = useState("");

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

  const isDirty = dirtyUpdates.length > 0;

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
    setStatus("idle");
    setStatusMessage("");
  }, []);

  const save = useCallback(async () => {
    if (!dirtyUpdates.length) return;
    setSaving(true);
    setStatus("saving");
    setStatusMessage("");
    const result = await saveVisualContentUpdates(dirtyUpdates);
    setSaving(false);
    if (!result.success) {
      setStatus("error");
      setStatusMessage(result.error);
      return;
    }
    setDrafts({});
    setBaselines({});
    setStatus("saved");
    router.refresh();
  }, [dirtyUpdates, router]);

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
      getValue,
      updateField,
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
      getValue,
      updateField,
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
  if (!ctx) {
    return {
      isActive: false,
      locale: "en" as Locale,
      dir: "ltr" as const,
      isDirty: false,
      saving: false,
      status: "idle" as const,
      statusMessage: "",
      getValue: (_key: VisualContentKey, fallback: string) => fallback,
      updateField: () => {},
      save: async () => {},
      cancel: () => {},
      exitVisualEdit: () => {},
    };
  }
  return ctx;
}

export function useVisualEditorActive() {
  return useVisualEditor().isActive;
}
