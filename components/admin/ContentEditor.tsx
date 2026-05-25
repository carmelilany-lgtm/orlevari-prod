"use client";

import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormField } from "@/components/admin/AdminFormField";
import {
  adminBtnPrimary,
  adminCardClass,
} from "@/components/admin/admin-styles";
import { saveSiteContent } from "@/lib/admin/actions/content";
import {
  formatContentKeyLabel,
  isLongContentKey,
  SITE_CONTENT_SECTIONS,
} from "@/lib/admin/content-keys";
import { adminCopy, contentSectionTitle } from "@/lib/admin/copy";
import type { SiteContentItem, SiteContentKey } from "@/types/content";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  initialContent: SiteContentItem[];
};

export function ContentEditor({ initialContent }: Props) {
  const router = useRouter();
  const initialMap = useMemo(
    () => Object.fromEntries(initialContent.map((r) => [r.key, r])),
    [initialContent],
  );

  const [values, setValues] = useState<
    Record<string, { value_en: string; value_he: string }>
  >(() => {
    const map: Record<string, { value_en: string; value_he: string }> = {};
    for (const section of SITE_CONTENT_SECTIONS) {
      for (const key of section.keys) {
        const row = initialMap[key];
        map[key] = {
          value_en: row?.value_en ?? "",
          value_he: row?.value_he ?? "",
        };
      }
    }
    return map;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const updates = Object.entries(values).map(([key, v]) => ({
      key,
      value_en: v.value_en || null,
      value_he: v.value_he || null,
    }));

    const result = await saveSiteContent(updates);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(adminCopy.content.saved);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 text-right">
      <p className="text-sm text-slate-400">{adminCopy.content.intro}</p>

      <AdminAlert variant="error" message={error} />
      <AdminAlert variant="success" message={success} />

      {SITE_CONTENT_SECTIONS.map((section) => (
        <section key={section.title} className={`${adminCardClass} space-y-4`}>
          <h2 className="text-lg font-semibold text-white">
            {contentSectionTitle(section.title)}
          </h2>
          <div className="space-y-6">
            {section.keys.map((key) => {
              const long = isLongContentKey(key as SiteContentKey);
              const v = values[key] ?? { value_en: "", value_he: "" };
              return (
                <div
                  key={key}
                  className="grid gap-4 border-t border-blue-950/60 pt-4 first:border-0 first:pt-0"
                >
                  <p className="text-sm font-medium text-blue-300/90" dir="ltr">
                    {formatContentKeyLabel(key)}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {long ? (
                      <>
                        <AdminFormField
                          as="textarea"
                          label={adminCopy.content.valueEn}
                          dir="ltr"
                          value={v.value_en}
                          onChange={(val) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], value_en: val },
                            }))
                          }
                        />
                        <AdminFormField
                          as="textarea"
                          label={adminCopy.content.valueHe}
                          dir="rtl"
                          value={v.value_he}
                          onChange={(val) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], value_he: val },
                            }))
                          }
                        />
                      </>
                    ) : (
                      <>
                        <AdminFormField
                          label={adminCopy.content.valueEn}
                          dir="ltr"
                          value={v.value_en}
                          onChange={(val) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], value_en: val },
                            }))
                          }
                        />
                        <AdminFormField
                          label={adminCopy.content.valueHe}
                          dir="rtl"
                          value={v.value_he}
                          onChange={(val) =>
                            setValues((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], value_he: val },
                            }))
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <button type="submit" className={adminBtnPrimary} disabled={loading}>
        {loading ? adminCopy.actions.saving : adminCopy.actions.saveAllContent}
      </button>
    </form>
  );
}
