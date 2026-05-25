"use client";

import { AdminFormField } from "@/components/admin/AdminFormField";
import { adminCopy } from "@/lib/admin/copy";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function SortOrderField({ value, onChange }: Props) {
  return (
    <AdminFormField
      label={adminCopy.categories.sortOrder}
      name="sort_order"
      type="number"
      value={value}
      min={0}
      onChange={(v) => onChange(Number(v) || 0)}
      hint={adminCopy.categories.sortHint}
    />
  );
}
