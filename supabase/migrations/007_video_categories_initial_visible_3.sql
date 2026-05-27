-- Set video category initial visible count to 3 (one row before Load More).
-- Safe for live DB: only updates rows still at default 6 or NULL.
-- Run in Supabase SQL Editor.

UPDATE public.video_categories
SET initial_visible_count = 3
WHERE initial_visible_count IS NULL OR initial_visible_count = 6;

-- Optional: change default for newly created categories
ALTER TABLE public.video_categories
  ALTER COLUMN initial_visible_count SET DEFAULT 3;
