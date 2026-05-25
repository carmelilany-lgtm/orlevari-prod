#!/usr/bin/env node
/**
 * Verifies Supabase seed/admin state without printing secrets or full emails.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envLocalPath = resolve(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envLocalPath)) return;
  const raw = readFileSync(envLocalPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function maskEmail(email) {
  const at = email.indexOf("@");
  if (at <= 0) return "(invalid)";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const maskedLocal =
    local.length <= 2 ? "*".repeat(local.length) : `${local[0]}***${local.at(-1)}`;
  return `${maskedLocal}@${domain}`;
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const allowedRaw = process.env.ADMIN_ALLOWED_EMAILS ?? "";

if (!url || !serviceKey) {
  console.error("Missing Supabase URL or service role key in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const tables = [
  "admin_users",
  "video_categories",
  "video_works",
  "still_images",
  "services",
  "site_content",
  "leads",
];

async function countTable(name) {
  const { count, error } = await admin
    .from(name)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`${name}: ${error.message}`);
  return count ?? 0;
}

async function main() {
  console.log("Setup verification (no secrets printed)\n");

  for (const t of tables) {
    const n = await countTable(t);
    console.log(`  ${t}: ${n} row(s)`);
  }

  const allowed = allowedRaw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  console.log(`\n  ADMIN_ALLOWED_EMAILS: ${allowed.length} configured`);
  for (const e of allowed) {
    console.log(`    - ${maskEmail(e)}`);
  }

  const { data: authData, error: authErr } =
    await admin.auth.admin.listUsers({ perPage: 50 });
  if (authErr) {
    console.log(`\n  Auth users: unable to list (${authErr.message})`);
  } else {
    const users = authData?.users ?? [];
    console.log(`\n  Supabase Auth users: ${users.length}`);
    for (const u of users) {
      const email = (u.email ?? "").toLowerCase();
      const inAllowed = allowed.includes(email);
      const { data: row } = await admin
        .from("admin_users")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      console.log(
        `    - ${maskEmail(email)} | in ADMIN_ALLOWED_EMAILS: ${inAllowed ? "yes" : "no"} | in admin_users: ${row ? "yes" : "no"}`,
      );
    }
  }

  const authCount = authErr ? -1 : (authData?.users ?? []).length;
  const adminRowCount = await countTable("admin_users");

  if (authCount === 0) {
    console.log(
      "\n  ACTION REQUIRED: No Supabase Auth users. Create one in Dashboard → Authentication → Users",
    );
    console.log(
      "  (email must match ADMIN_ALLOWED_EMAILS). Then sign in at /admin/login.",
    );
  } else if (adminRowCount === 0 && allowed.length > 0) {
    console.log(
      "\n  Note: admin_users is empty — first login upserts when email matches ADMIN_ALLOWED_EMAILS.",
    );
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
