-- Add or update WhatsApp CMS keys on an existing Supabase project.
-- Safe to run multiple times (upsert on key).
-- Run in Supabase SQL Editor. Does not delete or modify other rows.

INSERT INTO public.site_content (key, value_en, value_he)
VALUES
  ('whatsapp_enabled', 'true', 'true'),
  ('whatsapp_floating_enabled', 'true', 'true'),
  ('whatsapp_number', '', ''),
  (
    'whatsapp_message_en',
    'Hi, I''d like to ask about a video production project.',
    'Hi, I''d like to ask about a video production project.'
  ),
  (
    'whatsapp_message_he',
    'שלום, אשמח לקבל פרטים לגבי הפקת וידאו.',
    'שלום, אשמח לקבל פרטים לגבי הפקת וידאו.'
  )
ON CONFLICT (key) DO UPDATE SET
  value_en = EXCLUDED.value_en,
  value_he = EXCLUDED.value_he,
  updated_at = now();

-- After running: set whatsapp_number in /admin/content, then save.
-- Public site revalidates on save; env WHATSAPP_PHONE remains a fallback if CMS number is empty.
