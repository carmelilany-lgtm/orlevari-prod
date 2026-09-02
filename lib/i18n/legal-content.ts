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
  updatedLabel: "Last updated: September 2026",
  intro:
    "This policy explains how Lev Ari Productions (“we”) processes personal information on this website, in line with the Israeli Privacy Protection Law, 5741-1981, including Amendment No. 13 as published in Sefer HaChukim (in force from 14 August 2025). It is written in plain language so you can understand what is collected, why, and how to exercise your rights. It is not legal advice.",
  sections: [
    {
      heading: "Who is responsible",
      paragraphs: [
        "The controller of personal information collected through this site is Lev Ari Productions (לב ארי הפקות). For privacy requests use the homepage contact form or the contact details published on the site.",
        "This is a small independent production studio. We do not appoint a statutory privacy officer unless the law requires it for our size and activity.",
      ],
    },
    {
      heading: "Amendment 13 - how this site is run",
      paragraphs: [
        "Amendment 13 strengthened duties of notice, informed consent, purpose limitation, security, and data-subject rights, and expanded enforcement by the Privacy Protection Authority.",
        "On this site we: (1) collect contact details only after an unticked, active checkbox; (2) use those details only to handle your inquiry, not for marketing unless you later agree separately; (3) load optional analytics only after you choose to allow it; (4) describe processing below so you can access, correct, delete, or withdraw consent.",
      ],
    },
    {
      heading: "Information we collect",
      paragraphs: [
        "Contact form (if you submit it): full name, phone, email, service type, optional message, interface language, and the fact that you accepted this policy. We store that submission so we can reply.",
        "Necessary technical data: what is required to run the public site you asked for - for example language preference, accessibility display settings, and your privacy-notice choice stored in the browser. This is not used for advertising.",
        "Optional measurement: if you allow analytics in the notice, we may receive aggregated visit information (such as pages viewed and general device/browser type) to understand how the public site is used. It is not loaded until you allow it.",
        "We do not ask you to create a public account, and we do not intentionally collect government ID numbers or payment card data on this website.",
      ],
    },
    {
      heading: "Purposes and legal basis",
      paragraphs: [
        "Responding to project inquiries: your explicit consent given on the contact form.",
        "Operating the website (language, accessibility, hosting, security): processing that is necessary to provide the service you requested.",
        "Optional analytics: your separate consent via the privacy notice. You may refuse; the site still works.",
        "We do not sell personal information and we do not use contact-form data for a different purpose (for example newsletters) without a new, specific consent.",
      ],
    },
    {
      heading: "Contact form consent",
      paragraphs: [
        "The form checkbox is off by default. Submitting without it is blocked. If you do not consent, we cannot process that inquiry through the form.",
        "You may withdraw consent later by asking us (via the same contact channels) to stop using or to delete your submission, subject to legal retention duties.",
      ],
    },
    {
      heading: "Cookies and similar storage",
      paragraphs: [
        "Necessary: language cookie and accessibility preferences in the browser, plus the privacy choice you make in the notice. These support core functions of the public site.",
        "Optional: analytics only after consent. There is no advertising pixel and no marketing profile built from browsing this site unless you enable analytics.",
        "You can change the analytics choice on this page. You can also clear site data in your browser.",
      ],
    },
    {
      heading: "Service providers and transfers abroad",
      paragraphs: [
        "To run the site, store inquiries, and send operational email about a request you submitted, we use service providers. They process only what is needed for those purposes, including optional analytics if you allow it.",
        "Some processing may take place on servers outside Israel. We do not sell your information to third parties.",
      ],
    },
    {
      heading: "Retention and security",
      paragraphs: [
        "Contact submissions are kept as long as needed to handle the inquiry and for legitimate business or legal records, then deleted or anonymized.",
        "The site is served over HTTPS. Contact details you send are stored so we can reply, with server-side credentials that are not exposed to visitors. No security measure is perfect.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Subject to the Privacy Protection Law, you may request access to personal information we hold about you, correction of inaccurate data, deletion, and objection to or withdrawal of consent for processing that was based on consent.",
        "Send the request through the homepage contact form (or published contact details) and describe what you need. We will respond within a reasonable time as required by law.",
        "You may also contact the Privacy Protection Authority regarding your rights under Israeli law.",
      ],
    },
    {
      heading: "Email",
      paragraphs: [
        "If you contact us, we may send transactional email about that inquiry (confirmation or an internal team notice). We do not send marketing newsletters unless you agree separately.",
      ],
    },
  ],
  footerNote:
    "This policy is general information, not legal advice. We may update it when our practices or the law change. The Hebrew version is intended for visitors in Israel; if translations differ, the Hebrew text prevails for Israeli law.",
};

const privacyHe: LegalPageContent = {
  title: "מדיניות פרטיות",
  updatedLabel: "עודכן לאחרונה: ספטמבר 2026",
  intro:
    "מדיניות זו מסבירה כיצד לב ארי הפקות (“אנחנו”) מעבדת מידע אישי באתר זה, בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, לרבות תיקון מספר 13 כפי שפורסם בספר החוקים (בתוקף מ-14 באוגוסט 2025). היא כתובה בשפה ברורה: מה נאסף, למה, ואיך לממש זכויות. אין כאן ייעוץ משפטי.",
  sections: [
    {
      heading: "מי אחראי למידע",
      paragraphs: [
        "בעל השליטה במידע האישי שנאסף באתר הוא לב ארי הפקות. לבקשות פרטיות השתמשו בטופס יצירת הקשר בדף הבית או בפרטי הקשר המפורסמים באתר.",
        "זהו סטודיו הפקה עצמאי קטן. לא ממונה ממונה הגנת פרטיות סטטוטורי אלא אם החוק מחייב זאת לפי היקף הפעילות.",
      ],
    },
    {
      heading: "תיקון 13 - איך האתר פועל לפיו",
      paragraphs: [
        "תיקון 13 חיזק את חובות היידוע, ההסכמה מדעת, צמידות המטרה, אבטחת המידע וזכויות נושא המידע, והרחיב את סמכויות הרשות להגנת הפרטיות.",
        "באתר זה: (1) פרטי יצירת קשר נאספים רק אחרי סימון פעיל של תיבה שאינה מסומנת מראש; (2) הפרטים משמשים לטיפול בפנייה בלבד, לא לשיווק, אלא אם תסכימו לכך בנפרד בהמשך; (3) כלי מדידה אופציונלי נטען רק אם בחרתם לאפשר אותו; (4) מפורט להלן איך לעיין, לתקן, למחוק או לחזור מהסכמה.",
      ],
    },
    {
      heading: "איזה מידע נאסף",
      paragraphs: [
        "טופס יצירת קשר (אם נשלח): שם מלא, טלפון, אימייל, סוג שירות, הודעה אופציונלית, שפת הממשק, ואישור מדיניות זו. הפנייה נשמרת כדי שנוכל להשיב.",
        "מידע טכני הכרחי: מה שנדרש להפעלת האתר הציבורי שביקשתם - למשל העדפת שפה, הגדרות תצוגת נגישות, ובחירת הודעת הפרטיות שנשמרת בדפדפן. אין שימוש בזה לפרסום.",
        "מדידה אופציונלית: אם תאשרו אנליטיקה בהודעה, עשוי להיאסף מידע מצרפי על ביקורים (למשל עמודים וסוג מכשיר/דפדפן כללי) כדי להבין שימוש באתר. זה לא נטען לפני אישור.",
        "אין חשבון ציבורי באתר, ואין איסוף מכוון של מספר זהות או פרטי כרטיס אשראי באתר זה.",
      ],
    },
    {
      heading: "מטרות ובסיס לעיבוד",
      paragraphs: [
        "מענה לפניות על פרויקטים: הסכמתכם המפורשת בטופס.",
        "הפעלת האתר (שפה, נגישות, אירוח, אבטחה): עיבוד הנדרש למתן השירות שביקשתם.",
        "אנליטיקה אופציונלית: הסכמה נפרדת בהודעת הפרטיות. אפשר לסרב - האתר ימשיך לעבוד.",
        "איננו מוכרים מידע אישי, ואיננו משתמשים בנתוני הטופס למטרה אחרת (למשל דיוור) בלי הסכמה חדשה וספציפית.",
      ],
    },
    {
      heading: "הסכמה בטופס יצירת קשר",
      paragraphs: [
        "תיבת הסימון כבויה כברירת מחדל. בלי סימון לא ניתן לשלוח. בלי הסכמה לא נוכל לטפל בפנייה דרך הטופס.",
        "אפשר לחזור מההסכמה בהמשך ולבקש שנפסיק להשתמש בפנייה או שנמחק אותה, בכפוף לחובות שמירה בחוק.",
      ],
    },
    {
      heading: "עוגיות ואחסון דומה",
      paragraphs: [
        "הכרחי: עוגיה לשפה והעדפות נגישות בדפדפן, וכן בחירת הפרטיות שאתם עושים בהודעה. אלה תומכים בפעולת האתר הציבורי.",
        "אופציונלי: אנליטיקה רק אחרי הסכמה. אין פיקסל פרסום ואין בניית פרופיל שיווקי מגלישה באתר אלא אם אפשרתם אנליטיקה.",
        "אפשר לשנות את בחירת האנליטיקה בעמוד זה, או למחוק נתוני אתר בדפדפן.",
      ],
    },
    {
      heading: "ספקי שירות והעברה לחו״ל",
      paragraphs: [
        "להפעלת האתר, שמירת פניות ומשלוח מייל תפעולי על בקשה ששלחתם, נעזרים בספקי שירות. הם מעבדים רק מה שנדרש למטרות אלה, כולל מדידה אופציונלית אם אישרתם.",
        "חלק מהעיבוד עשוי להתבצע בשרתים מחוץ לישראל. איננו מוכרים את המידע שלכם לצדדים שלישיים.",
      ],
    },
    {
      heading: "שמירה ואבטחה",
      paragraphs: [
        "פניות נשמרות כל עוד נדרש לטיפול בפנייה ולתיעוד עסקי או משפטי לגיטימי, ואז נמחקות או מואנונימיות.",
        "האתר מוגש ב-HTTPS. פרטי יצירת קשר שנשלחים נשמרים כדי שנוכל להשיב, עם מפתחות בצד השרת שאינם חשופים למבקרים. אין אבטחה מושלמת.",
      ],
    },
    {
      heading: "הזכויות שלכם",
      paragraphs: [
        "בכפוף לחוק הגנת הפרטיות אפשר לבקש עיון במידע האישי שבידינו, תיקון מידע שאינו מדויק, מחיקה, והתנגדות או חזרה מהסכמה לגבי עיבוד שהתבסס על הסכמה.",
        "שלחו בקשה בטופס בדף הבית (או בפרטי הקשר המפורסמים) ותארו מה נדרש. נשיב בתוך זמן סביר כנדרש בחוק.",
        "אפשר גם לפנות לרשות להגנת הפרטיות בנוגע לזכויות לפי הדין בישראל.",
      ],
    },
    {
      heading: "דוא״ל",
      paragraphs: [
        "בעקבות פנייה ייתכן מייל תפעולי על אותה פנייה (אישור או התראה לצוות). אין דיוור שיווקי אלא אם תסכימו לכך בנפרד.",
      ],
    },
  ],
  footerNote:
    "מדיניות זו היא מידע כללי ואינה ייעוץ משפטי. ייתכנו עדכונים כשהנהלים או החוק משתנים. לנוסח העברי מעמד לעניין הדין בישראל אם יש הבדל בין שפות.",
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
        "A skip link lets keyboard users jump to the main content.",
        "We work toward Israeli Standard 5568 / WCAG 2.0 Level AA in the site’s own code. An accessibility menu is a user-preference aid; it is not a substitute for that work and is not a certification.",
      ],
    },
    {
      heading: "Accessibility menu",
      paragraphs: [
        "A compact accessibility control sits next to the language toggle (keyboard shortcut Alt+A) and lets visitors adjust text size, contrast, line spacing, link highlighting, a system readable font, and motion.",
        "These settings apply only as CSS classes on the page. They do not rewrite content, add automatic alt text, or claim to make the site fully compliant by themselves.",
        "Preferences are stored in the browser on this device. Reset returns the default display.",
      ],
    },
    {
      heading: "Keyboard navigation",
      paragraphs: [
        "Interactive controls such as buttons, links, and form fields are intended to be reachable and operable with a keyboard.",
        "The accessibility menu opens with Alt+A and can be closed with Escape.",
        "Video and stills viewers can be closed with the Escape key when open.",
      ],
    },
    {
      heading: "Contrast and readability",
      paragraphs: [
        "We use high-contrast text on dark backgrounds and visible focus indicators on interactive elements.",
        "Visitors can enlarge text from the accessibility menu or with the browser’s zoom. Pinch-to-zoom is enabled.",
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
        "קישור דילוג מאפשר מעבר לתוכן הראשי במקלדת.",
        "אנו פועלים ליישום ת״י 5568 / WCAG 2.0 ברמה AA בקוד האתר עצמו. תפריט הנגישות הוא כלי להעדפות תצוגה - אינו מחליף את התקן ואינו מהווה הסמכה.",
      ],
    },
    {
      heading: "תפריט נגישות",
      paragraphs: [
        "ליד מתג השפה יש כפתור נגישות קטן (קיצור מקלדת Alt+A) לשינוי גודל טקסט, ניגודיות, ריווח שורות, הדגשת קישורים, גופן מערכת קריא ועצירת אנימציות.",
        "ההגדרות מופעלות כמחלקות CSS בלבד. הן אינן משכתבות תוכן, אינן מוסיפות טקסט חלופי אוטומטי, ואינן מתיימרות להנגיש את האתר לבדן.",
        "ההעדפות נשמרות בדפדפן במכשיר זה. איפוס מחזיר את תצוגת ברירת המחדל.",
      ],
    },
    {
      heading: "ניווט מקלדת",
      paragraphs: [
        "רכיבים אינטראקטיביים כמו כפתורים, קישורים ושדות טופס אמורים להיות נגישים וניתנים להפעלה במקלדת.",
        "תפריט הנגישות נפתח ב-Alt+A ונסגר ב-Escape.",
        "ניתן לסגור צפייה בווידאו או בתמונות באמצעות מקש Escape כשהם פתוחים.",
      ],
    },
    {
      heading: "ניגודיות וקריאות",
      paragraphs: [
        "אנו משתמשים בטקסט בעל ניגודיות גבוהה על רקע כהה ובמחווני מיקוד נראים לרכיבים אינטראקטיביים.",
        "אפשר להגדיל טקסט מתפריט הנגישות או בהגדלת תצוגה בדפדפן. זום במגע זמין.",
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
