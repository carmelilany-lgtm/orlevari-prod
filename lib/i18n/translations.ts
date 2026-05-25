import type { Locale } from "@/types/i18n";

export type TranslationKeys = {
  brand: string;
  nav: {
    about: string;
    works: string;
    services: string;
    contact: string;
    menuOpen: string;
    menuClose: string;
    skipToContent: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaWorks: string;
    ctaContact: string;
    collageLabel: string;
  };
  about: {
    title: string;
    imageAlt: string;
    body: string;
  };
  works: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      video: string;
      stills: string;
    };
    loadMore: string;
    close: string;
    videoSectionLabel: string;
    stillsSectionLabel: string;
    cardPlaceholder: string;
    openVideo: string;
    openStill: string;
    emptyPortfolio: string;
    collage: {
      editCollage: string;
      modeLabel: string;
      save: string;
      saving: string;
      cancel: string;
      reset: string;
      hint: string;
      mobileWarning: string;
      resetConfirm: string;
      collageSaved: string;
      collageSaveFailed: string;
      collageResetDone: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      fullName: string;
      phone: string;
      email: string;
      serviceType: string;
      message: string;
      privacyAgree: string;
      privacyLink: string;
      submit: string;
      submitting: string;
      success: string;
      error: string;
      selectService: string;
      optional: string;
      requiredMark: string;
    };
    links: {
      phone: string;
      email: string;
      whatsapp: string;
    };
    placeholders: {
      phone: string;
      email: string;
    };
  };
  footer: {
    rights: string;
    privacy: string;
    accessibility: string;
  };
  legal: {
    backToHome: string;
  };
  floatingWhatsapp: string;
  langToggle: {
    en: string;
    he: string;
  };
};

const en: TranslationKeys = {
  brand: "Lev Ari Productions",
  nav: {
    about: "About",
    works: "Works",
    services: "Services",
    contact: "Contact",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    skipToContent: "Skip to main content",
  },
  hero: {
    title: "Lev Ari Productions",
    subtitle:
      "Cinematic video production for businesses, events & artists — turning real moments into meaningful stories.",
    ctaWorks: "View Works",
    ctaContact: "Contact Me",
    collageLabel: "Featured work collage preview",
  },
  about: {
    title: "About",
    imageAlt: "Portrait of Or, Lev Ari Productions",
    body: "Through my camera and creative craft, I tell stories that matter. Photography, videography, and editing allow me to capture the real emotion behind every moment. I approach each project with heart, precision, and personal attention, creating films and visuals that feel meaningful, authentic, and true to the people, businesses, and memories they represent.",
  },
  works: {
    title: "Works",
    subtitle: "Selected productions across film, events, and still photography.",
    filters: {
      all: "All",
      video: "Video",
      stills: "Stills",
    },
    loadMore: "Load More",
    close: "Close",
    videoSectionLabel: "Video productions",
    stillsSectionLabel: "Photography stills",
    cardPlaceholder: "Thumbnail placeholder",
    openVideo: "Play video",
    openStill: "View still image",
    emptyPortfolio: "Portfolio content will appear here once published.",
    collage: {
      editCollage: "Edit Collage",
      modeLabel: "Collage edit mode",
      save: "Save",
      saving: "Saving…",
      cancel: "Cancel",
      reset: "Reset layout",
      hint: "Drag images, resize them, then save",
      mobileWarning: "Collage editing works best on a desktop computer.",
      resetConfirm: "Reset the collage layout?",
      collageSaved: "Layout saved successfully.",
      collageSaveFailed: "Failed to save layout.",
      collageResetDone: "Collage layout was reset.",
    },
  },
  services: {
    title: "Services",
    subtitle: "End-to-end production tailored to your story and audience.",
  },
  contact: {
    title: "Contact",
    subtitle: "Tell me about your project — I will get back to you soon.",
    form: {
      fullName: "Full Name",
      phone: "Phone",
      email: "Email",
      serviceType: "Subject / Service Type",
      message: "Message (optional)",
      privacyAgree: "I agree to the",
      privacyLink: "Privacy Policy",
      submit: "Send Message",
      submitting: "Sending…",
      success:
        "Thank you. Your message was sent successfully. We'll get back to you soon.",
      error: "We couldn't send your message. Please try again in a moment.",
      selectService: "Choose a subject / service type",
      optional: "optional",
      requiredMark: "Required",
    },
    links: {
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp",
    },
    placeholders: {
      phone: "+972 50-000-0000",
      email: "hello@levari.productions",
    },
  },
  footer: {
    rights: "All rights reserved Lev Ari Productions 2026",
    privacy: "Privacy Policy",
    accessibility: "Accessibility Statement",
  },
  legal: {
    backToHome: "Back to home",
  },
  floatingWhatsapp: "Chat on WhatsApp",
  langToggle: {
    en: "English",
    he: "עברית",
  },
};

const he: TranslationKeys = {
  brand: "לב ארי הפקות",
  nav: {
    about: "אודות",
    works: "עבודות",
    services: "שירותים",
    contact: "יצירת קשר",
    menuOpen: "פתיחת תפריט",
    menuClose: "סגירת תפריט",
    skipToContent: "דילוג לתוכן הראשי",
  },
  hero: {
    title: "לב ארי הפקות",
    subtitle:
      "הפקות וידאו קולנועיות לעסקים, אירועים ואמנים — הופכים רגעים אמיתיים לסיפורים משמעותיים.",
    ctaWorks: "צפייה בעבודות",
    ctaContact: "יצירת קשר",
    collageLabel: "תצוגת קולאז' עבודות נבחרות",
  },
  about: {
    title: "אודות",
    imageAlt: "דיוקן של אור, לב ארי הפקות",
    body: "דרך המצלמה והיצירה, אני מספר סיפורים שיש להם משמעות. צילום, וידאו ועריכה מאפשרים לי לתפוס את הרגש האמיתי שמאחורי כל רגע. כל פרויקט נעשה מתוך לב, דיוק ויחס אישי, כדי ליצור תוצאה שמרגישה אותנטית, משמעותית ונאמנה לאנשים, לעסקים ולזיכרונות שהיא מייצגת.",
  },
  works: {
    title: "עבודות",
    subtitle: "מבחר הפקות בקולנוע, אירועים וצילום סטילס.",
    filters: {
      all: "הכל",
      video: "וידאו",
      stills: "סטילס",
    },
    loadMore: "טען עוד",
    close: "סגור",
    videoSectionLabel: "הפקות וידאו",
    stillsSectionLabel: "צילומי סטילס",
    cardPlaceholder: "ממוזג תמונה",
    openVideo: "נגן וידאו",
    openStill: "צפייה בתמונה",
    emptyPortfolio: "תוכן הפורטפוליו יופיע כאן לאחר פרסום בעבודות.",
    collage: {
      editCollage: "עריכת קולאז׳",
      modeLabel: "מצב עריכת קולאז׳",
      save: "שמירה",
      saving: "שומר…",
      cancel: "ביטול",
      reset: "איפוס פריסה",
      hint: "גרור תמונות, שנה גודל ולחץ שמירה",
      mobileWarning: "עריכת קולאז׳ מומלצת ממחשב.",
      resetConfirm: "האם לאפס את פריסת הקולאז׳?",
      collageSaved: "הפריסה נשמרה בהצלחה.",
      collageSaveFailed: "שמירת הפריסה נכשלה.",
      collageResetDone: "פריסת הקולאז׳ אופסה.",
    },
  },
  services: {
    title: "שירותים",
    subtitle: "הפקה מקצה לקצה, מותאמת לסיפור ולקהל שלכם.",
  },
  contact: {
    title: "יצירת קשר",
    subtitle: "ספרו לי על הפרויקט — אחזור אליכם בהקדם.",
    form: {
      fullName: "שם מלא",
      phone: "טלפון",
      email: "אימייל",
      serviceType: "נושא / סוג שירות",
      message: "הודעה (אופציונלי)",
      privacyAgree: "אני מאשר/ת את",
      privacyLink: "מדיניות הפרטיות",
      submit: "שליחת הודעה",
      submitting: "שולח…",
      success: "תודה, הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.",
      error: "לא הצלחנו לשלוח את הפנייה. נסה שוב בעוד רגע.",
      selectService: "בחר נושא / סוג שירות",
      optional: "אופציונלי",
      requiredMark: "שדה חובה",
    },
    links: {
      phone: "טלפון",
      email: "אימייל",
      whatsapp: "וואטסאפ",
    },
    placeholders: {
      phone: "050-0000000",
      email: "hello@levari.productions",
    },
  },
  footer: {
    rights: "כל הזכויות שמורות לב ארי הפקות 2026",
    privacy: "מדיניות פרטיות",
    accessibility: "הצהרת נגישות",
  },
  legal: {
    backToHome: "חזרה לדף הבית",
  },
  floatingWhatsapp: "צ'אט בוואטסאפ",
  langToggle: {
    en: "English",
    he: "עברית",
  },
};

export const translations: Record<Locale, TranslationKeys> = { en, he };
