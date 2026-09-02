-- About heading size token (sm | md | lg | xl). Language-agnostic: same value in both columns.
INSERT INTO public.site_content (key, value_en, value_he)
VALUES ('about_extended_title_size', 'md', 'md')
ON CONFLICT (key) DO NOTHING;
