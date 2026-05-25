"use server";

import type { ActionResult } from "@/lib/admin/action-result";
import { actionError, actionOk } from "@/lib/admin/action-result";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { Database } from "@/lib/supabase/types";

export type DashboardStats = {
  publishedVideos: number;
  categories: number;
  stillImages: number;
  services: number;
  leads: number;
};

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const [
    videosRes,
    categoriesRes,
    stillsRes,
    servicesRes,
    leadsRes,
  ] = await Promise.all([
    ctx.supabase
      .from("video_works")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    ctx.supabase
      .from("video_categories")
      .select("id", { count: "exact", head: true }),
    ctx.supabase.from("still_images").select("id", { count: "exact", head: true }),
    ctx.supabase.from("services").select("id", { count: "exact", head: true }),
    ctx.supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  if (videosRes.error) return actionError(videosRes.error.message);
  if (categoriesRes.error) return actionError(categoriesRes.error.message);
  if (stillsRes.error) return actionError(stillsRes.error.message);
  if (servicesRes.error) return actionError(servicesRes.error.message);
  if (leadsRes.error) return actionError(leadsRes.error.message);

  return actionOk({
    publishedVideos: videosRes.count ?? 0,
    categories: categoriesRes.count ?? 0,
    stillImages: stillsRes.count ?? 0,
    services: servicesRes.count ?? 0,
    leads: leadsRes.count ?? 0,
  });
}

export async function getRecentLeads(
  limit = 5,
): Promise<ActionResult<LeadRow[]>> {
  const ctx = await requireAdmin();
  if (!("supabase" in ctx)) return ctx;

  const { data, error } = await ctx.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return actionError(error.message);
  return actionOk(data ?? []);
}
