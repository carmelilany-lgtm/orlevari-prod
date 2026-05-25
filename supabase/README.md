# Supabase — Lev Ari Productions

Backend foundation for the bilingual portfolio site: database schema, RLS, storage, and seed data.

## 1. Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Note the **Project URL**, **anon key**, and **service role key** (Settings → API).
3. Copy `.env.example` to `.env.local` in the Next.js app root and fill in:

| Variable | Where used |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server (public, RLS-scoped) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never prefix with `NEXT_PUBLIC_` |
| `ADMIN_ALLOWED_EMAILS` | Comma-separated fallback allow-list (Step 3 admin UI) |
| `RESEND_API_KEY` | Server-only — contact form emails (Resend) |
| `EMAIL_FROM` | Verified Resend sender address |
| `CONTACT_NOTIFICATION_EMAIL` | Lead notification inbox for Or |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://lev-ari.com`) |

**Service role safety:** The service role bypasses RLS. Use only in Route Handlers, Server Actions, or scripts that run on the server. Never import `lib/supabase/admin.ts` from Client Components.

## 2. Run migrations

### Option A — Supabase CLI (recommended)

```bash
cd /path/to/lev-ari-productions
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### Option B — SQL Editor

1. Open **SQL Editor** in the dashboard.
2. Paste and run `supabase/migrations/001_initial_schema.sql`.
3. Paste and run `supabase/seed.sql`.

## 3. Seed data

After migrations:

```bash
supabase db execute --file supabase/seed.sql
```

Or run `supabase/seed.sql` in the SQL Editor.

Seed includes: video categories, services, and bilingual `site_content` keys. Video works and stills are added via the admin UI (Step 3).

Services seed is rerunnable: `icon_key` is unique and upserts on conflict. If you applied an older migration without `icon_key` unique, run:

```sql
ALTER TABLE public.services ADD CONSTRAINT services_icon_key_key UNIQUE (icon_key);
```

(or recreate from `001_initial_schema.sql` on a fresh project).

## 4. Storage buckets

Migration `001_initial_schema.sql` creates:

| Bucket | Purpose | Public read |
|--------|---------|-------------|
| `stills` | Masonry gallery uploads | Yes |
| `covers` | Custom video cover images | Yes |
| `about` | About section image | Yes |

Upload/update/delete requires an authenticated user whose email exists in `admin_users` (see storage policies in the migration).

If buckets were not created (older project), create them in **Storage → New bucket** with **Public** enabled, then re-run the storage policy section of the migration.

## 5. Tables

| Table | Purpose |
|-------|---------|
| `admin_users` | Allow-list of admin emails |
| `video_categories` | Portfolio video sections |
| `video_works` | YouTube portfolio items |
| `still_images` | Stills gallery metadata |
| `services` | Services section |
| `site_content` | Key/value bilingual CMS strings |
| `leads` | Contact form submissions (private) |

## 6. RLS summary

**Public (anon):**

- `SELECT` published rows on categories, works, stills, services.
- `SELECT` all `site_content`.
- `INSERT` on `leads` only (with `privacy_accepted = true` and required fields).
- No read access to `leads` or `admin_users`.

**Authenticated admin** (`is_admin()` = email in `admin_users`):

- Full CRUD on content tables and `SELECT`/`DELETE` on `leads`.
- `SELECT` on `admin_users`.
- Storage upload/update/delete on `stills`, `covers`, `about`.

**Service role:** Bypasses RLS — use only for bootstrapping (e.g. first admin row).

Helper: `public.is_admin()` compares `auth.jwt()->>'email'` to `admin_users.email`.

## 7. Add the first admin email

Use the **service role** (SQL Editor with service role, or a one-off server script):

```sql
INSERT INTO public.admin_users (email)
VALUES ('your-admin@example.com')
ON CONFLICT (email) DO NOTHING;
```

Also add the same email to `ADMIN_ALLOWED_EMAILS` in `.env.local` for Step 3 fallback checks:

```
ADMIN_ALLOWED_EMAILS=your-admin@example.com
```

The admin must sign in with Supabase Auth using that exact email (Step 3).

## 8. Auth (preparation)

- Enable **Email** provider in Authentication → Providers.
- Site URL / redirect URLs: add `http://localhost:3000` and production URL.
- Admin UI (Step 3) will use `@supabase/ssr` cookie sessions and `lib/auth/is-admin.ts`.

## 9. Regenerate TypeScript types (optional)

When the CLI is linked:

```bash
supabase gen types typescript --linked > lib/supabase/types.ts
```

Until then, `lib/supabase/types.ts` contains hand-written types matching the schema.

## 10. Local app without Supabase

The Next.js app runs without env vars: API helpers fall back to `data/mock.ts` and log a console warning. Configure Supabase when ready to load live content and accept leads.
