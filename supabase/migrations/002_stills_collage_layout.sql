-- Stills collage layout (admin-editable grid spans)
ALTER TABLE public.still_images
  ADD COLUMN IF NOT EXISTS collage_layout JSONB DEFAULT NULL;

COMMENT ON COLUMN public.still_images.collage_layout IS
  'Optional grid layout: { "w": 1-3, "h": 1-2, "size": "small"|"medium"|"wide"|"tall"|"large" }. NULL = masonry fallback on public site.';
