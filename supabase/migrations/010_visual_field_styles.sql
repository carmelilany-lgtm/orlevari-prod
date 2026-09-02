INSERT INTO public.site_content (key, value_en, value_he)
VALUES ('visual_field_styles', '{}', '{}')
ON CONFLICT (key) DO NOTHING;
