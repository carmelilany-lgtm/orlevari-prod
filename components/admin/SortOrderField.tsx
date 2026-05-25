"use client";

import { AdminFormField } from "@/components/admin/AdminFormField";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function SortOrderField({ value, onChange }: Props) {
  return (
    <AdminFormField
      label="Sort order"
      name="sort_order"
      type="number"
      value={value}
      min={0}
      onChange={(v) => onChange(Number(v) || 0)}
      hint="Lower numbers appear first"
    />
  );
}
