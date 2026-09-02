-- Lev Ari Productions - initial schema, RLS, storage, triggers
-- Run via Supabase CLI or SQL Editor after linking project.

-- ---------------------------------------------------------------------------
-- 1. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 2. Tables (all public tables before functions that reference them)
-- ---------------------------------------------------------------------------

-- A. admin_users - approved admin emails only
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users IS 'Allow-list for admin panel access; match auth user email.';

-- B. video_categories
CREATE TABLE IF NOT EXISTS public.video_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_he TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  initial_visible_count INTEGER NOT NULL DEFAULT 6,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. video_works
CREATE TABLE IF NOT EXISTS public.video_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.video_categories(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_he TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  youtube_id TEXT,
  thumbnail_url TEXT,
  custom_cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS video_works_category_id_idx ON public.video_works(category_id);
CREATE INDEX IF NOT EXISTS video_works_published_sort_idx ON public.video_works(is_published, sort_order);

-- D. still_images
CREATE TABLE IF NOT EXISTS public.still_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt_en TEXT,
  alt_he TEXT,
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS still_images_published_sort_idx ON public.still_images(is_published, sort_order);

-- E. services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_he TEXT NOT NULL,
  description_en TEXT,
  description_he TEXT,
  icon_key TEXT UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. site_content
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value_en TEXT,
  value_he TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. leads (private)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_type TEXT,
  message TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'he')),
  privacy_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. Reusable functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Admin check (RLS helper)
-- Uses JWT email claim - do NOT use user_metadata for authorization.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE email = (auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. updated_at triggers
-- ---------------------------------------------------------------------------
DROP TRIGGER IF EXISTS video_categories_set_updated_at ON public.video_categories;
CREATE TRIGGER video_categories_set_updated_at
  BEFORE UPDATE ON public.video_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS video_works_set_updated_at ON public.video_works;
CREATE TRIGGER video_works_set_updated_at
  BEFORE UPDATE ON public.video_works
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS still_images_set_updated_at ON public.still_images;
CREATE TRIGGER still_images_set_updated_at
  BEFORE UPDATE ON public.still_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS services_set_updated_at ON public.services;
CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS site_content_set_updated_at ON public.site_content;
CREATE TRIGGER site_content_set_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.still_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 6. RLS policies (after is_admin() exists)
-- ---------------------------------------------------------------------------

-- admin_users: no public access; admins can read allow-list
DROP POLICY IF EXISTS "admin_users_select_admin" ON public.admin_users;
CREATE POLICY "admin_users_select_admin"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- video_categories: public read published; admin full CRUD
DROP POLICY IF EXISTS "video_categories_select_published" ON public.video_categories;
CREATE POLICY "video_categories_select_published"
  ON public.video_categories FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "video_categories_admin_all" ON public.video_categories;
CREATE POLICY "video_categories_admin_all"
  ON public.video_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- video_works: public read published; admin full CRUD
DROP POLICY IF EXISTS "video_works_select_published" ON public.video_works;
CREATE POLICY "video_works_select_published"
  ON public.video_works FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "video_works_admin_all" ON public.video_works;
CREATE POLICY "video_works_admin_all"
  ON public.video_works FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- still_images: public read published; admin full CRUD
DROP POLICY IF EXISTS "still_images_select_published" ON public.still_images;
CREATE POLICY "still_images_select_published"
  ON public.still_images FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "still_images_admin_all" ON public.still_images;
CREATE POLICY "still_images_admin_all"
  ON public.still_images FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- services: public read published; admin full CRUD
DROP POLICY IF EXISTS "services_select_published" ON public.services;
CREATE POLICY "services_select_published"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "services_admin_all" ON public.services;
CREATE POLICY "services_admin_all"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_content: public read all keys; admin full CRUD
DROP POLICY IF EXISTS "site_content_select_public" ON public.site_content;
CREATE POLICY "site_content_select_public"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "site_content_admin_all" ON public.site_content;
CREATE POLICY "site_content_admin_all"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- leads: public insert only (contact form); admin read/delete
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
CREATE POLICY "leads_insert_public"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    privacy_accepted = TRUE
    AND language IN ('en', 'he')
    AND full_name IS NOT NULL
    AND TRIM(full_name) <> ''
    AND phone IS NOT NULL
    AND TRIM(phone) <> ''
    AND email IS NOT NULL
    AND TRIM(email) <> ''
  );

DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
CREATE POLICY "leads_select_admin"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "leads_delete_admin" ON public.leads;
CREATE POLICY "leads_delete_admin"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- No public SELECT/UPDATE/DELETE on leads
-- No public access to admin_users

-- ---------------------------------------------------------------------------
-- 7. Data API grants (tables in public schema)
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.video_categories TO anon, authenticated;
GRANT SELECT ON public.video_works TO anon, authenticated;
GRANT SELECT ON public.still_images TO anon, authenticated;
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;

GRANT SELECT ON public.admin_users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.video_works TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.still_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT SELECT, DELETE ON public.leads TO authenticated;

-- service_role bypasses RLS for bootstrap (add first admin, migrations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- ---------------------------------------------------------------------------
-- 8. Storage buckets and storage policies
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('stills', 'stills', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('covers', 'covers', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('about', 'about', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read; admin write
DROP POLICY IF EXISTS "stills_public_read" ON storage.objects;
CREATE POLICY "stills_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'stills');

DROP POLICY IF EXISTS "covers_public_read" ON storage.objects;
CREATE POLICY "covers_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "about_public_read" ON storage.objects;
CREATE POLICY "about_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'about');

DROP POLICY IF EXISTS "stills_admin_insert" ON storage.objects;
CREATE POLICY "stills_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'stills' AND public.is_admin());

DROP POLICY IF EXISTS "stills_admin_update" ON storage.objects;
CREATE POLICY "stills_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'stills' AND public.is_admin())
  WITH CHECK (bucket_id = 'stills' AND public.is_admin());

DROP POLICY IF EXISTS "stills_admin_delete" ON storage.objects;
CREATE POLICY "stills_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'stills' AND public.is_admin());

DROP POLICY IF EXISTS "covers_admin_insert" ON storage.objects;
CREATE POLICY "covers_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'covers' AND public.is_admin());

DROP POLICY IF EXISTS "covers_admin_update" ON storage.objects;
CREATE POLICY "covers_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'covers' AND public.is_admin())
  WITH CHECK (bucket_id = 'covers' AND public.is_admin());

DROP POLICY IF EXISTS "covers_admin_delete" ON storage.objects;
CREATE POLICY "covers_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'covers' AND public.is_admin());

DROP POLICY IF EXISTS "about_admin_insert" ON storage.objects;
CREATE POLICY "about_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'about' AND public.is_admin());

DROP POLICY IF EXISTS "about_admin_update" ON storage.objects;
CREATE POLICY "about_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'about' AND public.is_admin())
  WITH CHECK (bucket_id = 'about' AND public.is_admin());

DROP POLICY IF EXISTS "about_admin_delete" ON storage.objects;
CREATE POLICY "about_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'about' AND public.is_admin());
