-- Default initial_visible_count for new video categories: 3 (one row before Load More).
ALTER TABLE public.video_categories
  ALTER COLUMN initial_visible_count SET DEFAULT 3;
