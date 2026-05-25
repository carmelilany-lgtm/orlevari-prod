# Live integrations setup — Lev Ari Productions

Step-by-step guide to connect a real Supabase project and Resend account before production deploy (Step 5).

**Do not commit `.env.local`.** Never put `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` in `NEXT_PUBLIC_*` variables.

---

## A. Supabase project creation

1. Create a project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server only)
3. In the app root:

   ```bash
   cp .env.example .env.local
   ```

4. Paste the three Supabase values into `.env.local`.

5. Verify presence only (no secret values printed):

   ```bash
   npm run check:env
   ```

---

## B. Run database migration

### Option A — Supabase CLI (recommended)

```bash
cd /Users/carmelilany/Projects/lev-ari-productions
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### Option B — SQL Editor

1. Dashboard → **SQL Editor** → New query.
2. Paste and run the full file: `supabase/migrations/001_initial_schema.sql`.
3. Paste and run `supabase/migrations/002_stills_collage_layout.sql` (adds `still_images.collage_layout`).
4. Confirm no errors (tables, RLS, storage buckets `stills`, `covers`, `about`).

---

## C. Run seed file

After migration succeeds:

Paste `supabase/seed.sql` into the **SQL Editor** and run.

Some Supabase CLI versions also support:

```bash
supabase db execute --file supabase/seed.sql
```

If that command is unknown, use the SQL Editor or `npm run verify:setup` to confirm row counts.

**Confirm in Table Editor:**

| Table | Expected |
|-------|----------|
| `video_categories` | 9 rows (corporate, events, family, …) |
| `services` | 6 rows |
| `site_content` | Keys: `hero_title`, `contact_title`, `seo_title_en`, etc. |

Re-running seed is safe: categories and `site_content` upsert on conflict; services upsert on `icon_key`.

---

## D. Storage buckets

Migration `001_initial_schema.sql` creates public buckets:

| Bucket | Purpose |
|--------|---------|
| `stills` | Masonry gallery |
| `covers` | Custom video covers |
| `about` | About section image |

**Policies (from migration):**

- **Public read** on all three buckets.
- **Admin write** (insert/update/delete) only when `public.is_admin()` is true (email in `admin_users`).

If buckets are missing (partial migration), create them in **Storage → New bucket** with **Public** enabled, then re-run the storage policy section from the migration file.

---

## E. Create first admin user

### 1. Auth user (Dashboard)

1. **Authentication → Users → Add user**.
2. Email + password (e.g. `admin@yourdomain.com`).
3. Enable **Email** provider under **Authentication → Providers** if not already on.

### 2. Allow-list in database

**Option A — SQL (service role / SQL Editor as postgres):**

```sql
INSERT INTO public.admin_users (email)
VALUES ('admin@yourdomain.com')
ON CONFLICT (email) DO NOTHING;
```

**Option B — Env bootstrap on first login**

Add to `.env.local`:

```
ADMIN_ALLOWED_EMAILS=admin@yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=...   # required for auto-insert into admin_users
```

On first successful login, the app calls `ensureAdminUserInDatabase()` and upserts the email into `admin_users` when it matches `ADMIN_ALLOWED_EMAILS`.

### 3. Auth redirect URLs

**Authentication → URL configuration:**

- Site URL: `http://localhost:3000` (local) and production URL later.
- Redirect URLs: `http://localhost:3000/**`, production `https://yourdomain.com/**`

---

## F. Resend setup

1. Sign up at [https://resend.com](https://resend.com).
2. **Domains** → add and verify your sending domain (DNS records).
3. **API Keys** → create key → `RESEND_API_KEY` in `.env.local`.
4. Set verified sender:

   ```
   EMAIL_FROM=Lev Ari Productions <noreply@yourdomain.com>
   ```

5. Set internal inbox for new leads:

   ```
   CONTACT_NOTIFICATION_EMAIL=or@yourdomain.com
   ```

6. Run `npm run check:env` — Resend vars should show **present**.

**Note:** Without Resend, the contact form still saves leads when Supabase is configured; emails are skipped with a server warning.

---

## G. Public site & CMS (Step 5)

After Supabase is connected, the homepage loads **published** rows only (no mock portfolio when env is set but tables are empty).

| Content | Admin | Public behavior |
|---------|-------|-----------------|
| Hero, About, Works/Services/Contact titles, SEO | `/admin/content` | CMS value → translation fallback; empty/whitespace CMS = missing |
| Phone, email, WhatsApp | `/admin/content` keys `phone`, `email`, `whatsapp_number`, `whatsapp_message_*` | Shown only when set; no fake placeholders on live site |
| Services cards | `/admin/services` | Published, `sort_order`; section hidden if none published |
| Videos / categories / stills | `/admin/videos`, `/admin/categories`, `/admin/stills` | Published only; empty categories hidden; `initial_visible_count` per category |
| Contact service dropdown | — | Built from published service titles + Other/אחר |

**WhatsApp:** Controlled in `/admin/content` (number, EN/HE messages, contact + floating toggles). CMS `whatsapp_number` first, then optional `WHATSAPP_PHONE` in `.env.local`. Buttons stay hidden until a valid number exists. On an existing DB, run **[whatsapp-cms-upsert.sql](./whatsapp-cms-upsert.sql)** once, then set the number in admin and save.

**SEO:** Edit `seo_title_en`, `seo_description_en`, etc. in content admin; set `NEXT_PUBLIC_SITE_URL` for canonical/Open Graph base.

Admin mutations revalidate `/` automatically.

---

## H. Local test flow

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Step | Action | Expected |
|------|--------|----------|
| 1 | Sign in at `/admin/login` | Dashboard loads |
| 2 | `/admin/integrations` | Env flags yes; operational checks pass when configured |
| 3 | `/admin/categories` | List seeded categories; create/edit works |
| 4 | `/admin/videos` | Add YouTube URL; published video on public site |
| 5 | `/admin/stills` | Upload JPG/PNG/WebP; appears in works stills |
| 6 | `/admin/services` | Edit seeded service |
| 7 | `/admin/content` | Edit hero/contact copy |
| 8 | Public contact form (EN) | Success message; lead in `/admin/leads` |
| 9 | Public contact form (HE) | RTL confirmation email if Resend on |
| 10 | Inbox | Internal notification + customer confirmation |

**Manual email test:** Use the public contact form (no arbitrary test recipient). Optional: send integration test only via documented Resend dashboard if needed.

---

## I. Production notes (Vercel)

See **[deploy-vercel.md](./deploy-vercel.md)** for the full Vercel import, env var list, Supabase Auth redirect URLs, Resend domain verification, and post-deploy checklist.

Summary:

1. **Environment variables** (Vercel → Settings → Environment Variables): copy from `.env.local` for Production (Preview optional).
2. **Resend:** Verify production domain; use production `EMAIL_FROM`.
3. **`NEXT_PUBLIC_SITE_URL`:** Set to `https://your-production-domain.com` (not localhost).
4. **Supabase:** `supabase db push` + seed on the linked project.
5. **Auth:** Add production + `*.vercel.app` redirect URLs.
6. Deploy; smoke-test `/admin/login`, one upload, one contact submission.

---

## Quick diagnostics

| Command / page | Purpose |
|----------------|---------|
| `npm run check:env` | Terminal: present/missing for each var (no values) |
| `npm run verify:setup` | Table row counts; masked admin/auth status (no secrets) |
| `/admin/integrations` | In-app readiness after admin login |
| `npm run build` | Production build sanity |
| `npm run lint` | ESLint |

---

## H. Stills gallery (upload + live collage)

### Upload multiple images

1. Admin → **גלריית תמונות** → choose one or more JPG/PNG/WebP files (≤ 10MB each).
2. Optional alt text and sort order apply to the whole batch.
3. Per-file errors appear in the list; a partial batch shows e.g. `הועלו 7 מתוך 8 תמונות`.

### Edit collage on the public site

1. Sign in as admin (same browser session as the public site).
2. Open the homepage **#works** section, or use **עריכת קולאז׳** (admin-only button).
3. Or open `/?editCollage=1#works` from admin → **גלריית תמונות** → **עריכת קולאז׳**.
4. Drag and resize tiles on desktop, then **שמירה**. Mobile visitors keep masonry layout.
5. **איפוס פריסה** clears saved layout and returns to automatic masonry.

Recommended: edit from a desktop/laptop (wide grid).

### Upload error messages (admin)

| Message | Likely cause |
|---------|----------------|
| סוג הקובץ לא נתמך | Not JPG/PNG/WebP |
| הקובץ גדול מדי | Over 10MB (or server action body limit misconfigured) |
| העלאה ל־Storage נכשלה | Bucket/policy/MIME; check `/admin/integrations` |
| שמירת התמונה במסד הנתונים נכשלה | DB insert after upload |
| אין הרשאה להעלות תמונות | Not in `admin_users` (storage uses `is_admin()`) |

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Admin login → access denied | Email in `admin_users` or `ADMIN_ALLOWED_EMAILS`; service role for bootstrap |
| Upload fails | Buckets exist; user is admin; file type JPG/PNG/WebP ≤ 10MB; `next.config` `serverActions.bodySizeLimit` ≥ 11mb |
| Lead not saved | `NEXT_PUBLIC_SUPABASE_*` set; RLS `leads_insert_public`; privacy checkbox; contact API must not `.select()` after insert (anon has INSERT only on `leads`) |
| No emails | `RESEND_API_KEY`, `EMAIL_FROM` (verified), `CONTACT_NOTIFICATION_EMAIL` |
| Public site empty | Seed ran; categories `is_published = true` |
| `is_admin()` false | JWT email must match `admin_users.email` exactly (lowercase in DB) |

See also [supabase/README.md](../supabase/README.md) and [README.md](../README.md).
