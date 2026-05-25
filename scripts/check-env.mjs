#!/usr/bin/env node
/**
 * Prints present/missing for required env vars. Never prints secret values.
 * Loads .env.local when present (Node does not load it automatically).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const REQUIRED = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", critical: true, group: "Supabase" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", critical: true, group: "Supabase" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", critical: false, group: "Supabase" },
  { key: "ADMIN_ALLOWED_EMAILS", critical: false, group: "Admin" },
  { key: "RESEND_API_KEY", critical: false, group: "Resend" },
  { key: "EMAIL_FROM", critical: false, group: "Resend" },
  { key: "CONTACT_NOTIFICATION_EMAIL", critical: false, group: "Resend" },
  { key: "NEXT_PUBLIC_SITE_URL", critical: false, group: "Site" },
  { key: "WHATSAPP_PHONE", critical: false, group: "Site" },
];

function status(key) {
  const v = process.env[key];
  return v !== undefined && String(v).trim() !== "" ? "present" : "missing";
}

console.log("Lev Ari Productions — environment check\n");
if (existsSync(envLocalPath)) {
  console.log(`Loaded: .env.local\n`);
} else {
  console.log(`No .env.local found (checking process.env only)\n`);
}

let criticalMissing = 0;
let warnings = 0;

for (const { key, critical, group } of REQUIRED) {
  const s = status(key);
  const icon = s === "present" ? "✓" : "✗";
  console.log(`  ${icon} [${group}] ${key}: ${s}`);
  if (s === "missing") {
    if (critical) criticalMissing += 1;
    else warnings += 1;
  }
}

console.log("");

const supabasePublic =
  status("NEXT_PUBLIC_SUPABASE_URL") === "present" &&
  status("NEXT_PUBLIC_SUPABASE_ANON_KEY") === "present";

if (!supabasePublic) {
  console.log(
    "Note: Without Supabase public vars, the site uses mock data and the contact form cannot persist leads.",
  );
}

if (
  status("RESEND_API_KEY") === "missing" ||
  status("EMAIL_FROM") === "missing"
) {
  console.log(
    "Note: Without Resend vars, leads may still save; emails are skipped.",
  );
}

if (criticalMissing > 0) {
  console.log(
    `\n${criticalMissing} critical Supabase var(s) missing for live data.`,
  );
  process.exit(1);
}

if (warnings > 0) {
  console.log(`\n${warnings} optional var(s) missing — OK for partial local setup.`);
}

console.log("\nEnv check complete (no secret values were printed).");
process.exit(0);
