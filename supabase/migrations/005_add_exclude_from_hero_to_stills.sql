-- Exclude specific stills from the random hero/header pool (inverse of opt-in).
ALTER TABLE public.still_images
ADD COLUMN IF NOT EXISTS exclude_from_hero boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.still_images.exclude_from_hero IS
  'When true, this published still is hidden from the public hero collage random pool.';
