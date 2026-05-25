import { isCurrentUserAdmin } from "@/lib/auth/is-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** Lightweight admin check for public-site edit controls (no secrets). */
export async function GET() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ isAdmin: false });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ isAdmin: false });
  }

  const isAdmin = await isCurrentUserAdmin();
  return NextResponse.json({ isAdmin });
}
