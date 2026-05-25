-- Seed data for Lev Ari Productions (run after migrations)
-- Safe to re-run: uses ON CONFLICT where applicable.

-- Video categories
INSERT INTO public.video_categories (slug, title_en, title_he, sort_order, initial_visible_count)
VALUES
  ('corporate', 'Corporate Films', 'סרטי תדמית', 1, 6),
  ('events', 'Events', 'אירועים', 2, 6),
  ('family', 'Family Films', 'סרטי משפחה', 3, 6),
  ('music-shows', 'Music & Shows', 'הופעות ומוזיקה', 4, 6),
  ('documentary', 'Documentary', 'דוקומנטרי', 5, 6),
  ('short-films', 'Short Films', 'סרטים קצרים', 6, 6),
  ('news', 'News & Reports', 'כתבות וחדשות', 7, 6),
  ('haam-im-hagolan', 'Ha''am Im HaGolan', 'העם עם הגולן', 8, 6),
  ('cooking', 'Cooking Shows', 'תוכניות בישול', 9, 6)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he,
  sort_order = EXCLUDED.sort_order,
  initial_visible_count = EXCLUDED.initial_visible_count;

-- Services (rerunnable via icon_key)
INSERT INTO public.services (title_en, title_he, description_en, description_he, icon_key, sort_order)
VALUES
  (
    'Event Filming',
    'צילום אירועים',
    'Weddings, celebrations, and live events captured with cinematic precision.',
    'חתונות, אירועים והופעות — בצילום קולנועי מדויק.',
    'events',
    1
  ),
  (
    'Social Media Production',
    'הפקות סושיאל',
    'Short-form content crafted for impact across platforms.',
    'תוכן קצר ומדויק, מותאם לרשתות החברתיות.',
    'social',
    2
  ),
  (
    'Shows',
    'הופעות',
    'Live performances and stage productions brought to life on screen.',
    'הופעות חיות והפקות במה — מועברות לקולנוע.',
    'shows',
    3
  ),
  (
    'Documentary',
    'דוקומנטרי',
    'Authentic storytelling with depth, research, and emotional truth.',
    'סיפורים אמיתיים עם עומק, מחקר ורגש.',
    'documentary',
    4
  ),
  (
    'Family Films',
    'סרטי משפחה',
    'Legacy films that preserve memories for generations.',
    'סרטי מורשת ששומרים על זיכרונות משפחתיים.',
    'family',
    5
  ),
  (
    'Music Videos',
    'קליפים',
    'Visual narratives that amplify artists and their music.',
    'נרטיב ויזואלי שמחזק אמנים ומוזיקה.',
    'music-videos',
    6
  )
ON CONFLICT (icon_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he,
  description_en = EXCLUDED.description_en,
  description_he = EXCLUDED.description_he,
  sort_order = EXCLUDED.sort_order;

-- Site content
INSERT INTO public.site_content (key, value_en, value_he)
VALUES
  ('hero_title', 'Lev Ari Productions', 'לב ארי הפקות'),
  (
    'hero_subtitle',
    'Cinematic video production for businesses, events & artists — turning real moments into meaningful stories.',
    'הפקות וידאו קולנועיות לעסקים, אירועים ואמנים — הופכים רגעים אמיתיים לסיפורים משמעותיים.'
  ),
  ('hero_primary_button', 'View Our Work', 'לעבודות שלנו'),
  ('hero_secondary_button', 'Get in Touch', 'צור קשר'),
  ('about_title', 'About Or', 'אודות אור'),
  ('about_image_url', '', ''),
  ('about_image_storage_path', '', ''),
  (
    'about_text',
    'Through my camera and creative craft, I tell stories that matter. Photography, videography, and editing allow me to capture the real emotion behind every moment. I approach each project with heart, precision, and personal attention, creating films and visuals that feel meaningful, authentic, and true to the people, businesses, and memories they represent.',
    'דרך המצלמה והיצירה, אני מספר סיפורים שיש להם משמעות. צילום, וידאו ועריכה מאפשרים לי לתפוס את הרגש האמיתי שמאחורי כל רגע. כל פרויקט נעשה מתוך לב, דיוק ויחס אישי, כדי ליצור תוצאה שמרגישה אותנטית, משמעותית ונאמנה לאנשים, לעסקים ולזיכרונות שהיא מייצגת.'
  ),
  ('works_title', 'Our Work', 'העבודות שלנו'),
  ('services_title', 'Services', 'שירותים'),
  ('contact_title', 'Contact', 'צור קשר'),
  (
    'contact_intro',
    'Tell us about your project — we''ll get back to you soon.',
    'ספרו לנו על הפרויקט — נחזור אליכם בהקדם.'
  ),
  ('phone', '+972-50-000-0000', '+972-50-000-0000'),
  ('email', 'hello@lev-ari.com', 'hello@lev-ari.com'),
  ('whatsapp_number', '', ''),
  ('whatsapp_enabled', 'true', 'true'),
  ('whatsapp_floating_enabled', 'true', 'true'),
  (
    'whatsapp_message_en',
    'Hi, I''d like to ask about a video production project.',
    'Hi, I''d like to ask about a video production project.'
  ),
  (
    'whatsapp_message_he',
    'שלום, אשמח לקבל פרטים לגבי הפקת וידאו.',
    'שלום, אשמח לקבל פרטים לגבי הפקת וידאו.'
  ),
  ('seo_title_en', 'Lev Ari Productions | Cinematic Video', 'Lev Ari Productions | וידאו קולנועי'),
  ('seo_title_he', 'לב ארי הפקות | הפקות וידאו קולנועיות', 'לב ארי הפקות | הפקות וידאו קולנועיות'),
  (
    'seo_description_en',
    'Cinematic video production for businesses, events, and artists in Israel.',
    'הפקות וידאו קולנועיות לעסקים, אירועים ואמנים בישראל.'
  ),
  (
    'seo_description_he',
    'הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.',
    'הפקות וידאו קולנועיות לעסקים, אירועים ואמנים.'
  )
ON CONFLICT (key) DO UPDATE SET
  value_en = EXCLUDED.value_en,
  value_he = EXCLUDED.value_he;
