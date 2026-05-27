-- Add About section CMS keys on an existing Supabase project.
-- Safe to run multiple times: inserts missing keys only (ON CONFLICT DO NOTHING).
-- Does not overwrite existing non-empty CMS values.
-- Run in Supabase SQL Editor.

INSERT INTO public.site_content (key, value_en, value_he)
VALUES
  (
    'about_intro',
    'Through my camera and creative craft, I tell stories that matter — with heart, precision, and a cinematic eye.',
    'דרך המצלמה והיצירה, אני מספר סיפורים שיש להם משמעות — מתוך לב, דיוק וראייה קולנועית.'
  ),
  (
    'about_extended_title',
    'Nice to meet you, I''m Or Lev Ari.',
    'נעים מאוד, אור לב ארי.'
  ),
  (
    'about_extended_text',
    'I''m a video creator and editor based in Israel, working with businesses, artists, and families who want their story told with clarity and cinematic quality. From concept to final cut, I handle filming, editing, and production with a fast, attentive workflow — so every project feels personal, polished, and true to the people behind it.',
    'אני יוצר ועורך וידאו, עובד עם עסקים, אמנים ומשפחות שרוצים לספר את הסיפור שלהם בצורה ברורה, מדויקת וקולנועית. מהרעיון ועד הגזירה הסופית — צילום, עריכה והפקה מלאה, עם יחס אישי, זריזות ועין קולנועית שמביאה כל פרויקט לחיים.'
  ),
  (
    'about_extended_quote',
    'I believe every project deserves care, clarity and a cinematic point of view.',
    'אני מאמין שכל פרויקט צריך לקבל יחס אישי, דיוק וראייה קולנועית.'
  ),
  ('about_extended_image_url', '', ''),
  ('about_extended_image_storage_path', '', '')
ON CONFLICT (key) DO NOTHING;

-- After running: edit values in /admin/content or use the visual editor on the homepage.
