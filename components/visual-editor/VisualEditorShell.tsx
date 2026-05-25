"use client";

import { VisualEditorProvider } from "@/components/visual-editor/VisualEditorProvider";
import { VisualEditorToolbar } from "@/components/visual-editor/VisualEditorToolbar";
import { useLanguage } from "@/lib/i18n/context";
import { usePublicAdmin } from "@/hooks/use-public-admin";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, type ReactNode } from "react";

const TOOLBAR_OFFSET_CLASS = "pt-[4.75rem]";

function VisualEditorShellInner({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const { isAdmin, loading } = usePublicAdmin();
  const searchParams = useSearchParams();
  const router = useRouter();

  const visualEditFromQuery =
    searchParams.get("visualEdit") === "1" ||
    searchParams.get("visualEdit") === "true";

  const isActive = !loading && isAdmin && visualEditFromQuery;

  const exitVisualEdit = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("visualEdit");
    const next = `${url.pathname}${url.search}${url.hash}`;
    router.replace(next, { scroll: false });
  }, [router]);

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <VisualEditorProvider key={locale} isActive onExit={exitVisualEdit}>
      <VisualEditorToolbar />
      <div className={cn(TOOLBAR_OFFSET_CLASS)}>{children}</div>
    </VisualEditorProvider>
  );
}

export function VisualEditorShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <VisualEditorShellInner>{children}</VisualEditorShellInner>
    </Suspense>
  );
}
