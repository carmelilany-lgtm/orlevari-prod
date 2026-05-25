-- Live collage editor stores x/y/w/h in still_images.collage_layout (JSONB).
-- Example: { "x": 0, "y": 0, "w": 2, "h": 3 }
-- Column added in 002_stills_collage_layout.sql; this migration documents the shape only.

COMMENT ON COLUMN public.still_images.collage_layout IS
  'Optional collage grid item: x, y (0-based), w, h (1-12 cols), optional size preset. NULL = masonry fallback.';
