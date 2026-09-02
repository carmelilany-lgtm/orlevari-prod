# Deploy on Vercel - Lev Ari Productions

Production deployment checklist. **Never commit `.env.local` or paste real secrets into docs.**

---

## Prerequisites (local)

1. Copy `.env.example` → `.env.local` and fill values locally only.
2. Verify (no secret values printed):

   ```bash
   npm run check:env
   npm run verify:setup
   ```

3. Link Supabase and apply migrations:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

4. Run seed (choose one):
   - **SQL Editor:** paste and run `supabase/seed.sql`
   - **CLI (newer Supabase CLI):** `supabase db execute --file supabase/seed.sql` if your CLI version supports it

   Confirm counts: `npm run verify:setup` → 9 categories, 6 services, 19 `site_content` keys.

5. First admin (see [setup-live-integrations.md](./setup-live-integrations.md#e-create-first-admin-user)).

6. Local smoke test:

   ```bash
   npm run dev
   ```

   - `/admin/login` loads; protected routes redirect when logged out.
   - Contact form saves leads (anon INSERT only - no `.select()` on insert).
   - `npm run build` and `npm run lint` pass.

---

## Vercel: import project

1. [Vercel Dashboard](https://vercel.com) → **Add New** → **Project** → import the GitHub repo.
2. Framework: **Next.js**
3. Build: `npm run build`
4. Install: `npm install`
5. Add **Environment Variables** (Production; add Preview too if preview deploys should hit real Supabase/Resend).

| Variable | Client-safe? | Notes |
|----------|--------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Same as local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Same as local |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server only |
| `ADMIN_ALLOWED_EMAILS` | **No** | Comma-separated admin emails |
| `RESEND_API_KEY` | **No** | Server only |
| `EMAIL_FROM` | **No** | Verified domain in Resend |
| `CONTACT_NOTIFICATION_EMAIL` | **No** | Inbox for lead alerts |
| `NEXT_PUBLIC_SITE_URL` | Yes | **Production URL**, e.g. `https://yourdomain.com` |
| `GOOGLE_SITE_VERIFICATION` | **No** | Optional Search Console HTML-tag token |
| `WHATSAPP_PHONE` | Public-like | As configured locally |

Copy values from `.env.local` except `NEXT_PUBLIC_SITE_URL` - use the real production domain on Vercel Production.

Deploy after env vars are set (recommended before first production deploy).

---

## Supabase Auth URLs (production + preview)

**Authentication → URL Configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://yourdomain.com` (production) |
| Redirect URLs | `http://localhost:3000/**` |
| | `https://yourdomain.com/**` |
| | `https://*.vercel.app/**` |
| | `https://your-project.vercel.app/**` (if known) |

Missing redirect URLs break admin login after deploy.

For local dev, Site URL can be `http://localhost:3000`.

---

## Resend (production)

1. Add and verify sending domain (DNS at registrar).
2. `EMAIL_FROM` must use that domain, e.g. `Lev Ari Productions <noreply@yourdomain.com>`.
3. `CONTACT_NOTIFICATION_EMAIL` = inbox for new leads.

If the domain is **not** verified: leads still save in Supabase; email delivery may fail or be skipped.

---

## Pre-deploy blockers (local)

| Blocker | How to resolve |
|---------|----------------|
| **No Supabase Auth admin user** | Dashboard → Authentication → Users → Add user (email = `ADMIN_ALLOWED_EMAILS`). Sign in at `/admin/login`. |
| **Supabase Auth redirect URLs** | Add `http://localhost:3000/**`, production domain, and `https://*.vercel.app/**` under Authentication → URL Configuration. |
| **Resend domain not verified** | Leads still save; email may fail. Verify domain in Resend before relying on production email. |
| **Uncommitted setup fixes** | Commit `lib/api/leads.ts` (contact INSERT without `.select()`), docs, and `scripts/verify-setup.mjs` before GitHub → Vercel deploy. |
| **`supabase/.temp/`** | Do not commit (CLI cache). |

Run `npm run verify:setup` after creating the Auth user to confirm `admin_users` and masked admin status.

---

## Legal pages (public)

- `/he/privacy-policy` and `/en/privacy-policy` - Hebrew and English
- `/he/accessibility-statement` and `/en/accessibility-statement`
- Unprefixed `/privacy-policy` redirects to the Hebrew URL

---

## Post-deploy checklist

- [ ] Production site loads at `NEXT_PUBLIC_SITE_URL`
- [ ] `/privacy-policy` and `/accessibility-statement` load in EN and HE
- [ ] `/admin/login` - sign in with Supabase Auth admin user
- [ ] `/admin/integrations` - Supabase + Resend flags configured (no secret values shown)
- [ ] Edit one category / service / CMS field
- [ ] Add one YouTube video in admin
- [ ] Upload one still (stills bucket + `still_images` row)
- [ ] Contact form (EN + HE) → leads in `/admin/leads`; emails if Resend verified
- [ ] Public site shows uploaded still / published video

---

## Commands reference

```bash
npm run check:env      # env presence only
npm run verify:setup   # table counts + masked admin/auth status
npm run build
npm run lint
supabase db push
```

See also [setup-live-integrations.md](./setup-live-integrations.md) and [supabase/README.md](../supabase/README.md).
