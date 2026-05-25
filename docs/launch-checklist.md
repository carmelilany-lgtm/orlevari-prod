# Lev Ari Productions — Launch Checklist

Use this checklist before and after deploying to production. Do not commit secrets (`.env`, `.env.local`, API keys).

## Pre-launch

### Hosting & environment (Vercel)

- [ ] Project linked on Vercel
- [ ] Production env vars set (see `npm run check:env`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `ADMIN_ALLOWED_EMAILS`
  - `NEXT_PUBLIC_SITE_URL` — production URL (HTTPS, no trailing slash), used for SEO `metadataBase`, sitemap, robots, auth redirects
  - `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_NOTIFICATION_EMAIL`
  - Optional: `WHATSAPP_PHONE`
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain

### Supabase

- [ ] Migrations applied (`supabase db push` or dashboard)
- [ ] Seed data applied if starting fresh
- [ ] At least one admin user exists in Auth + `admin_users` (or allowed email list)
- [ ] Auth redirect URLs include production site + `/admin` paths
- [ ] RLS policies enabled (do not weaken for convenience)
- [ ] Storage bucket `stills` configured with expected policies

### Email (Resend)

- [ ] Sending domain verified in Resend
- [ ] `EMAIL_FROM` uses verified domain
- [ ] Test contact form delivers notification + customer confirmation

### Content & legal

- [ ] Legal pages live: `/privacy-policy`, `/accessibility-statement`
- [ ] Footer links to legal pages work
- [ ] Homepage CMS content reviewed (hero, about, contact, SEO fields)

### SEO technical

- [ ] `https://<domain>/sitemap.xml` lists `/`, `/privacy-policy`, `/accessibility-statement` (no `/admin`)
- [ ] `https://<domain>/robots.txt` allows public site, disallows `/admin`, references sitemap
- [ ] Page titles/descriptions and Open Graph tags render correctly
- [ ] Custom 404 page (`app/not-found.tsx`) loads for unknown public URLs

### Anti-spam

- [ ] Contact honeypot field remains hidden (`company_website`)
- [ ] Server-side rate limit active on `POST /api/contact` (8 requests / 15 min / IP, best-effort on serverless)
- [ ] If spam increases: add [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) or reCAPTCHA (documented future upgrade — no keys in repo)

---

## Post-launch smoke tests

### Public site

- [ ] Homepage loads over HTTPS
- [ ] EN/HE language toggle works; RTL layout correct in Hebrew
- [ ] Works: video categories, YouTube modal opens on click (iframe only after click)
- [ ] Stills gallery and lightbox work on mobile
- [ ] Services and contact sections show live CMS/DB data
- [ ] Contact form submits successfully
- [ ] Footer legal links open correct pages

### Admin (Hebrew RTL)

- [ ] `/admin/login` works for allowed admin
- [ ] Add/edit/publish video works; invalid YouTube URL rejected with clear message
- [ ] Upload still image works; alt text saved
- [ ] Edit site content saves and appears on public site after revalidation
- [ ] Leads list shows new contact submissions; search filter works
- [ ] “העתקת קישור לאתר” copies production URL when `NEXT_PUBLIC_SITE_URL` is set

### Email & integrations

- [ ] Owner notification email received
- [ ] Customer confirmation email received (EN and HE submissions)
- [ ] `/admin/integrations` shows expected env/connection status

### Mobile & accessibility (informal)

- [ ] Layout checked on phone (header, works, form, footer)
- [ ] Keyboard: modals close with Escape; focus visible on interactive elements
- [ ] Images have alt text where provided

---

## Maintenance (operators)

### Add a video

1. Admin → **סרטונים** → **הוספת סרטון**
2. Enter EN/HE titles, category, valid YouTube URL
3. Set sort order; toggle **פעיל באתר** to publish
4. Save — public homepage revalidates automatically

### Add a still image

1. Admin → **גלריית תמונות**
2. Optional alt text (EN/HE), sort order, publish checkbox
3. Choose JPG/PNG/WebP (max 10MB)
4. After upload, verify in public stills section

### Edit homepage text

1. Admin → **תוכן האתר**
2. Edit bilingual fields (hero, about, works, services, contact, SEO)
3. Save — empty CMS values fall back to built-in translations

### Check leads

1. Admin → **פניות**
2. Use search to filter by name, email, phone, or service
3. Open **צפייה** for full message; delete when processed

### Update environment variables

1. Vercel project → Settings → Environment Variables
2. Update values for Production (and Preview if needed)
3. Redeploy for changes to take effect
4. Run locally: `npm run check:env` after updating `.env.local`

### Optional stronger spam protection

1. Register Turnstile site key + secret in Cloudflare
2. Add widget to public contact form + verify token in `app/api/contact/route.ts`
3. Keep honeypot and rate limit as defense in depth

---

## Quality commands (before release)

```bash
npm run check:env
npm run verify:setup
npm run lint
npm run build
```

Ensure `git status` does not stage: `.env.local`, `.env`, `supabase/.temp`, `.next`, `node_modules`, `.vercel`.
