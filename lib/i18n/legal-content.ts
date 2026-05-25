import type { Locale } from "@/types/i18n";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  title: string;
  updatedLabel: string;
  intro: string;
  sections: LegalSection[];
  footerNote: string;
};

const privacyEn: LegalPageContent = {
  title: "Privacy Policy",
  updatedLabel: "Last updated: May 2026",
  intro:
    "This page describes how Lev Ari Productions (“we”, “the site”) handles information when you use our public website and contact form. We aim to be transparent and keep data use limited to what is needed to operate the site and respond to inquiries.",
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "When you browse the public site, we may receive standard technical information such as browser type, device type, and general usage data through our hosting and analytics providers.",
        "We do not ask you to create a public account on this website.",
      ],
    },
    {
      heading: "Contact form submissions",
      paragraphs: [
        "If you submit the contact form, we collect the details you provide (for example: name, phone, email, service type, message, and language preference).",
        "You must confirm acceptance of this privacy policy before a submission is processed.",
      ],
    },
    {
      heading: "How we use information",
      paragraphs: [
        "We use contact submissions to respond to your inquiry, understand your project needs, and improve our services.",
        "We do not sell your personal information.",
      ],
    },
    {
      heading: "Email communications",
      paragraphs: [
        "When you contact us, we may send transactional emails related to your inquiry (for example, a confirmation or internal notification to our team).",
        "We do not send marketing newsletters unless you separately agree to receive them.",
      ],
    },
    {
      heading: "Data storage",
      paragraphs: [
        "Contact submissions may be stored in our database so we can review and follow up on leads.",
        "Data is retained for as long as needed for business operations and legal obligations, then deleted or anonymized when no longer required.",
      ],
    },
    {
      heading: "Third-party services",
      paragraphs: [
        "We use trusted third-party providers to host the website, store data, send operational emails, and support site management. Contact data and site content may be processed and stored by these providers under configured security rules.",
        "Email notifications related to contact form submissions include only the details needed to respond. Hosting and infrastructure providers may process standard request logs and analytics.",
        "Sensitive configuration and credentials are kept server-side and are not exposed to visitors.",
      ],
    },
    {
      heading: "User rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, or delete personal information we hold about you.",
        "To exercise these rights, contact us using the details below. We will respond within a reasonable timeframe.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "For privacy questions or requests regarding your data, use the contact form on the homepage or the contact details published on the site.",
      ],
    },
  ],
  footerNote:
    "This policy is provided for general information and does not constitute legal advice. Practices may be updated as the site evolves.",
};

const privacyHe: LegalPageContent = {
  title: "מדיניות פרטיות",
  updatedLabel: "עודכן לאחרונה: מאי 2026",
  intro:
    "עמוד זה מתאר כיצד לב ארי הפקות (“אנחנו”, “האתר”) מטפלת במידע בעת שימוש באתר הציבורי ובטופס יצירת הקשר. אנו שואפים לשקיפות ולשימוש במידע רק במידה הנדרשת להפעלת האתר ולמענה לפניות.",
  sections: [
    {
      heading: "איזה מידע נאסף",
      paragraphs: [
        "בעת גלישה באתר הציבורי, ייתכן שנקבל מידע טכני סטנדרטי כגון סוג דפדפן, סוג מכשיר ונתוני שימוש כלליים דרך ספקי האירוח והאנליטיקה.",
        "איננו מבקשים יצירת חשבון ציבורי באתר זה.",
      ],
    },
    {
      heading: "פניות דרך טופס יצירת קשר",
      paragraphs: [
        "במסירת טופס יצירת קשר, נאספים הפרטים שמסרת (למשל: שם, טלפון, אימייל, סוג שירות, הודעה והעדפת שפה).",
        "יש לאשר את מדיניות הפרטיות לפני עיבוד הפנייה.",
      ],
    },
    {
      heading: "שימוש במידע",
      paragraphs: [
        "אנו משתמשים בפניות כדי להשיב, להבין את צרכי הפרויקט ולשפר את השירותים.",
        "איננו מוכרים מידע אישי.",
      ],
    },
    {
      heading: "הודעות מייל",
      paragraphs: [
        "בעקבות פנייה, ייתכן שנשלח מיילים תפעוליים (למשל אישור או התראה פנימית לצוות).",
        "לא נשלח דיוור שיווקי אלא אם הסכמת לכך בנפרד.",
      ],
    },
    {
      heading: "שמירת מידע",
      paragraphs: [
        "פניות עשויות להישמר במסד הנתונים לצורך מעקב וטיפול.",
        "המידע נשמר כל עוד נדרש לפעילות העסק ולחובות משפטיות, ולאחר מכן עשוי להימחק או להיות אנונימי.",
      ],
    },
    {
      heading: "שירותי צד שלישי",
      paragraphs: [
        "אנו משתמשים בספקי שירות מהימנים לאירוח האתר, אחסון מידע, שליחת מיילים תפעוליים ותמיכה בניהול האתר. נתוני קשר ותוכן האתר עשויים להיות מעובדים ונשמרים אצל ספקים אלה תחת כללי אבטחה מוגדרים.",
        "התראות מייל הקשורות לטופס יצירת קשר כוללות רק את הפרטים הנדרשים למענה. ספקי אירוח ותשתית עשויים לעבד לוגים ואנליטיקה סטנדרטיים.",
        "הגדרות ופרטי גישה רגישים נשמרים בצד השרת ואינם נחשפים למבקרים.",
      ],
    },
    {
      heading: "זכויות המשתמש",
      paragraphs: [
        "בהתאם למיקומך, עשויות להיות לך זכויות לעיין, לתקן או למחוק מידע אישי.",
        "למימוש הזכויות, פנה אלינו בפרטי הקשר למטה. נשיב בתוך זמן סביר.",
      ],
    },
    {
      heading: "יצירת קשר",
      paragraphs: [
        "לשאלות פרטיות או בקשות בנוגע למידע שלך, השתמש בטופס יצירת הקשר בדף הבית או בפרטי הקשר המפורסמים באתר.",
      ],
    },
  ],
  footerNote:
    "מדיניות זו מסופקת למידע כללי ואינה מהווה ייעוץ משפטי. הנהלים עשויים להתעדכן עם התפתחות האתר.",
};

const accessibilityEn: LegalPageContent = {
  title: "Accessibility Statement",
  updatedLabel: "Last updated: May 2026",
  intro:
    "Lev Ari Productions aims to provide an accessible experience for visitors. We continue to improve the site and welcome feedback if you encounter barriers.",
  sections: [
    {
      heading: "Website accessibility efforts",
      paragraphs: [
        "We use semantic HTML, clear headings, and readable typography where possible.",
        "The public site supports English (LTR) and Hebrew (RTL) with a language toggle.",
        "We do not claim formal certification or full compliance with any specific standard; we work toward practical usability for a broad audience.",
      ],
    },
    {
      heading: "Keyboard navigation",
      paragraphs: [
        "Interactive controls such as buttons, links, and form fields are intended to be reachable and operable with a keyboard.",
        "Video and stills viewers can be closed with the Escape key when open.",
      ],
    },
    {
      heading: "Contrast and readability",
      paragraphs: [
        "We use high-contrast text on dark backgrounds and visible focus indicators on interactive elements.",
        "Font sizes are chosen for comfortable reading on mobile and desktop without excessive scaling.",
      ],
    },
    {
      heading: "Forms and media",
      paragraphs: [
        "Contact form fields are associated with visible labels. Error and success messages use roles that assistive technologies can announce.",
        "Images include alternative text or descriptive fallbacks where applicable. Embedded YouTube players load only when a video modal is opened.",
      ],
    },
    {
      heading: "Known limitations",
      paragraphs: [
        "Some third-party embeds (such as YouTube) may not offer the same level of accessibility as native site content.",
        "Decorative placeholder imagery in the hero and about sections does not convey specific photographic content.",
        "We are reviewing ongoing improvements; reported issues help us prioritize fixes.",
      ],
    },
    {
      heading: "Contact for accessibility issues",
      paragraphs: [
        "If you experience difficulty using any part of the site, please contact us via the homepage contact form and describe the page, device, and browser you used.",
        "We will do our best to assist you and address barriers where feasible.",
      ],
    },
  ],
  footerNote:
    "This statement describes our current efforts and is not a guarantee of perfect accessibility in every scenario.",
};

const accessibilityHe: LegalPageContent = {
  title: "הצהרת נגישות",
  updatedLabel: "עודכן לאחרונה: מאי 2026",
  intro:
    "לב ארי הפקות שואפת לספק חוויית שימוש נגישה למבקרים. אנו ממשיכים לשפר את האתר ומעריכים משוב אם נתקלתם במחסום.",
  sections: [
    {
      heading: "התאמות נגישות באתר",
      paragraphs: [
        "אנו משתמשים ב-HTML סמנטי, כותרות ברורות וטיפוגרפיה קריאה ככל האפשר.",
        "האתר הציבורי תומך באנגלית (LTR) ובעברית (RTL) עם מתג שפה.",
        "איננו טוענים להסמכה רשמית או לעמידה מלאה בתקן מסוים; אנו פועלים לשימושיות מעשית לקהל רחב.",
      ],
    },
    {
      heading: "ניווט מקלדת",
      paragraphs: [
        "רכיבים אינטראקטיביים כמו כפתורים, קישורים ושדות טופס אמורים להיות נגישים וניתנים להפעלה במקלדת.",
        "ניתן לסגור צפייה בווידאו או בתמונות באמצעות מקש Escape כשהם פתוחים.",
      ],
    },
    {
      heading: "ניגודיות וקריאות",
      paragraphs: [
        "אנו משתמשים בטקסט בעל ניגודיות גבוהה על רקע כהה ובמחווני מיקוד נראים לרכיבים אינטראקטיביים.",
        "גודל הגופנים נבחר לקריאה נוחה במובייל ובמחשב ללא הגדלה מוגזמת.",
      ],
    },
    {
      heading: "טפסים ומדיה",
      paragraphs: [
        "לשדות טופס יצירת הקשר יש תוויות גלויות. הודעות שגיאה והצלחה משתמשות בתפקידים שטכנולוגיות מסייעות יכולות להכריז עליהם.",
        "לתמונות יש טקסט חלופי או תיאור חלופי במידת האפשר. נגן YouTube נטען רק כאשר מודל הווידאו נפתח.",
      ],
    },
    {
      heading: "מגבלות ידועות",
      paragraphs: [
        "הטמעות צד שלישי (כגון YouTube) עשויות שלא להציע את אותה רמת נגישות כמו תוכן האתר עצמו.",
        "תמונות דקורטיביות בחלק הגיבור והאודות אינן מציגות תוכן צילומי ספציפי.",
        "אנו בוחנים שיפורים מתמשכים; דיווחים על בעיות עוזרים לנו לתעדף תיקונים.",
      ],
    },
    {
      heading: "יצירת קשר בנושא נגישות",
      paragraphs: [
        "אם נתקלתם בקושי בשימוש בחלק כלשהו באתר, פנו אלינו דרך טופס יצירת הקשר בדף הבית וציינו את העמוד, המכשיר והדפדפן.",
        "נעשה מאמץ לסייע ולטפל במחסומים במידת האפשר.",
      ],
    },
  ],
  footerNote:
    "הצהרה זו מתארת את המאמצים הנוכחיים ואינה ערובה לנגישות מושלמת בכל מצב.",
};

const privacyByLocale = { en: privacyEn, he: privacyHe } as const;
const accessibilityByLocale = {
  en: accessibilityEn,
  he: accessibilityHe,
} as const;

export function getPrivacyPolicyContent(locale: Locale): LegalPageContent {
  return privacyByLocale[locale];
}

export function getAccessibilityStatementContent(
  locale: Locale,
): LegalPageContent {
  return accessibilityByLocale[locale];
}
