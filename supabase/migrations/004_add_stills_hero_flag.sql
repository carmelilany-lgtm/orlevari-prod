-- Hero/header background: mark published stills for the homepage hero collage.
ALTER TABLE public.still_images
ADD COLUMN IF NOT EXISTS show_in_hero boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.still_images.show_in_hero IS
  'When true and is_published, image is preferred for the public hero collage background.';
