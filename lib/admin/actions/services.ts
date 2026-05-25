"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { adminErrors } from "@/lib/admin/copy";
import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { Database } from "@/lib/supabase/types";

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export async function listServices(): Promise<ActionResult<ServiceRow[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}

export type ServiceInput = {
  id?: string;
  title_en: string;
  title_he: string;
  description_en: string | null;
  description_he: string | null;
  icon_key: string | null;
  sort_order: number;
  is_published: boolean;
};

function validateService(input: ServiceInput): string | null {
  if (!input.title_en.trim()) return adminErrors.titleEnRequired;
  if (!input.title_he.trim()) return adminErrors.titleHeRequired;
  return null;
}

export async function saveService(
  input: ServiceInput,
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const validation = validateService(input);
  if (validation) return actionError(validation);

  const payload = {
    title_en: input.title_en.trim(),
    title_he: input.title_he.trim(),
    description_en: input.description_en?.trim() || null,
    description_he: input.description_he?.trim() || null,
    icon_key: input.icon_key?.trim() || null,
    sort_order: input.sort_order,
    is_published: input.is_published,
  };

  if (input.id) {
    const { data, error } = await ctx.supabase
      .from("services")
      .update(payload)
      .eq("id", input.id)
      .select("id")
      .single();

    if (error) return actionError(error.message);
    revalidatePublicSite();
    return actionOk({ id: data.id });
  }

  const { data, error } = await ctx.supabase
    .from("services")
    .insert(payload)
    .select("id")
    .single();

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk({ id: data.id });
}

export async function deleteService(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase.from("services").delete().eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}

export async function toggleServicePublished(
  id: string,
  is_published: boolean,
): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { error } = await ctx.supabase
    .from("services")
    .update({ is_published })
    .eq("id", id);

  if (error) return actionError(error.message);
  revalidatePublicSite();
  return actionOk();
}
