"use client";

import { AdminFormField } from "@/components/admin/AdminFormField";
import {
  WHATSAPP_FIELD_META,
  WHATSAPP_SITE_CONTENT_KEYS,
  booleanToStored,
  parseStoredBoolean,
} from "@/lib/admin/whatsapp-content-fields";
import type { WhatsAppSiteContentKey } from "@/lib/admin/whatsapp-content-fields";

type ContentValues = Record<string, { value_en: string; value_he: string }>;

type Props = {
  values: ContentValues;
  setValues: React.Dispatch<React.SetStateAction<ContentValues>>;
};

function setShared(
  setValues: Props["setValues"],
  key: WhatsAppSiteContentKey,
  value: string,
) {
  setValues((prev) => ({
    ...prev,
    [key]: { value_en: value, value_he: value },
  }));
}

function setBoolean(
  setValues: Props["setValues"],
  key: WhatsAppSiteContentKey,
  enabled: boolean,
) {
  const stored = booleanToStored(enabled);
  setValues((prev) => ({
    ...prev,
    [key]: { value_en: stored, value_he: stored },
  }));
}

export function WhatsAppContentFields({ values, setValues }: Props) {
  return (
    <div className="space-y-6 border-t border-blue-800/40 pt-6">
      <h3 className="text-base font-medium text-slate-300">WhatsApp</h3>
      {WHATSAPP_SITE_CONTENT_KEYS.map((key) => {
        const meta = WHATSAPP_FIELD_META[key];
        const v = values[key] ?? { value_en: "", value_he: "" };

        if (meta.kind === "phone") {
          const number = v.value_en || v.value_he || "";
          return (
            <AdminFormField
              key={key}
              label={meta.label}
              hint={meta.helper}
              dir="ltr"
              value={number}
              placeholder="972501234567"
              onChange={(val) => setShared(setValues, key, val)}
            />
          );
        }

        if (meta.kind === "message_en") {
          return (
            <AdminFormField
              key={key}
              as="textarea"
              label={meta.label}
              dir="ltr"
              rows={3}
              value={v.value_en}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], value_en: val },
                }))
              }
            />
          );
        }

        if (meta.kind === "message_he") {
          return (
            <AdminFormField
              key={key}
              as="textarea"
              label={meta.label}
              dir="rtl"
              rows={3}
              value={v.value_he}
              onChange={(val) =>
                setValues((prev) => ({
                  ...prev,
                  [key]: { ...prev[key], value_he: val },
                }))
              }
            />
          );
        }

        const enabled = parseStoredBoolean(v.value_en || v.value_he || "true");
        return (
          <AdminFormField
            key={key}
            as="select"
            label={meta.label}
            value={enabled ? "true" : "false"}
            options={[
              { value: "true", label: "פעיל" },
              { value: "false", label: "מוסתר" },
            ]}
            onChange={(val) => setBoolean(setValues, key, val === "true")}
          />
        );
      })}
    </div>
  );
}
