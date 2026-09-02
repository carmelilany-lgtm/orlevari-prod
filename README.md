# Lev Ari Productions / לב ארי הפקות

Cinematic bilingual portfolio website foundation (Next.js App Router, TypeScript, Tailwind CSS).

## Run locally

```bash
cd /Users/carmelilany/Projects/lev-ari-productions
npm install
cp .env.example .env.local   # optional - not required for static UI
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` when connecting Supabase, Resend, and admin auth.

| Variable | Required for UI | Notes |
|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | App uses mock data if missing |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Public reads + lead insert (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-only admin/bootstrap |
| `ADMIN_ALLOWED_EMAILS` | No | Step 3 admin login fallback |
| `NEXT_PUBLIC_SITE_URL` | No | Auth redirects, SEO `metadataBase`, Open Graph |
| `WHATSAPP_PHONE` | No | Fallback WhatsApp number if CMS `whatsapp_number` is empty (server → public) |
| `RESEND_API_KEY` | No | Server-only - contact form emails |
| `EMAIL_FROM` | No | Verified Resend sender (e.g. `Lev Ari Productions <noreply@yourdomain.com>`) |
| `CONTACT_NOTIFICATION_EMAIL` | No | Or’s inbox for new lead notifications |

`RESEND_API_KEY` must never be exposed to the browser. `EMAIL_FROM` must use a **verified domain/sender** in the [Resend dashboard](https://resend.com/domains).

See **[supabase/README.md](./supabase/README.md)** for migrations, seed, RLS, storage buckets, and first admin setup.

For connecting real Supabase + Resend before deploy, see **[docs/setup-live-integrations.md](./docs/setup-live-integrations.md)** and **[docs/deploy-vercel.md](./docs/deploy-vercel.md)**.

```bash
npm run check:env      # present/missing env vars (no secret values)
npm run verify:setup   # Supabase table counts + masked admin status
```

After admin login, open **/admin/integrations** for in-app readiness checks.

### Admin stills (summary)

- Bulk upload: multiple JPG/PNG/WebP files per batch (10MB each), uploaded sequentially.
- Hero/header: random published gallery images; **אל תציג בהדר** excludes a still from the hero only.
- Collage editor (`/?editCollage=1#works`): drag and resize tiles on desktop, then save.

## Contact form & Resend (Step 4)

When a visitor submits the public contact form:

1. Server validates input (including language `en` | `he` and privacy acceptance).
2. Lead is saved to Supabase `leads` (if configured).
3. Internal notification email → `CONTACT_NOTIFICATION_EMAIL`.
4. Customer confirmation email → submitter’s address (English or Hebrew RTL by `language`).

**If email sending fails after the lead is saved**, the API still returns success. Errors are logged server-side only - never exposed to the browser.

**If Resend env vars are missing**, leads still save when Supabase is configured; emails are skipped with a server warning.

### Test Resend locally

1. Copy `.env.example` → `.env.local`.
2. Set `RESEND_API_KEY` from [Resend API keys](https://resend.com/api-keys).
3. Set `EMAIL_FROM` to a verified sender (domain verified under Resend → Domains).
4. Set `CONTACT_NOTIFICATION_EMAIL` to the inbox that should receive lead alerts.
5. Configure Supabase vars so leads persist.
6. Run `npm run dev`, submit the contact form in English and Hebrew.
7. Confirm the lead in `/admin/leads`, the internal email, and the customer confirmation (Hebrew email should render RTL).

Without Resend configured, the UI and lead insert still work; only emails are skipped.

## Project structure

```
app/                    # Next.js App Router (layout, page, API routes)
  api/contact/          # Contact form → leads table
components/
  layout/               # Header, Footer
  sections/             # Hero, About, Works, Services, Contact
  services/             # ServiceCard
  works/                # Video/stills grids, filters, modal placeholders
  ui/                   # Button, forms, toggles, floating WhatsApp
  providers/            # Language + SiteData (Supabase/mock)
data/                   # mock.ts, mock-works, categories, services
lib/
  api/                  # portfolio, content, services, leads
  auth/                 # is-admin helpers (Step 3)
  data/                 # loadSitePortfolioData
  i18n/                 # translations + React context
  supabase/             # client, server, admin, types, mappers
  resend/               # Resend client, templates, send helpers (server-only)
supabase/
  migrations/           # 001_initial_schema.sql
  seed.sql
types/                  # language, portfolio, content, services, leads, works
```

## Public site data (Step 5)

| Condition | Portfolio (videos, stills, services) | CMS text (hero, about, contact copy, SEO) | Contact phone / email / WhatsApp |
|-----------|--------------------------------------|-------------------------------------------|----------------------------------|
| No Supabase env | `data/mock.ts` | Translations fallback | Translation placeholders + dev WhatsApp |
| Supabase configured, rows published | Live admin data | CMS → translations fallback | CMS → hide if missing |
| Supabase configured, nothing published | Empty sections (no mock portfolio) | CMS → translations fallback | CMS only; hide missing links |

- Contact **Service Type** dropdown: published services only (active language), plus “Other” / “אחר”.
- WhatsApp priority: CMS `whatsapp_number` → `WHATSAPP_PHONE` env → hidden on live site if both missing.
- Homepage SEO: `generateMetadata` uses CMS `seo_*` keys (English default); `NEXT_PUBLIC_SITE_URL` sets `metadataBase` when set.
- Admin saves call `revalidatePath('/')`; homepage is `force-dynamic` for fresh public data.

## Languages

- Default: English (LTR)
- Secondary: Hebrew (RTL)
- Toggle in header; preference stored in `localStorage` (`lev-ari-locale`)

## Deploy (Vercel)

Push to GitHub and import in Vercel. `@vercel/analytics` is included in the root layout.
