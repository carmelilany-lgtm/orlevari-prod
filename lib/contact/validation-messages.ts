import type { Language } from "@/types/language";

export type ContactValidationMessages = {
  fullNameRequired: string;
  fullNameTooShort: string;
  phoneRequired: string;
  phoneInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  serviceTypeRequired: string;
  privacyRequired: string;
  messageTooLong: string;
};

const en: ContactValidationMessages = {
  fullNameRequired: "Please enter your full name.",
  fullNameTooShort: "Full name must be at least 2 characters.",
  phoneRequired: "Please enter your phone number.",
  phoneInvalid: "Please enter a valid phone number.",
  emailRequired: "Please enter your email address.",
  emailInvalid: "Please enter a valid email address.",
  serviceTypeRequired: "Please choose a subject / service type.",
  privacyRequired: "Please accept the privacy policy before submitting.",
  messageTooLong: "Your message is too long.",
};

const he: ContactValidationMessages = {
  fullNameRequired: "יש להזין שם מלא.",
  fullNameTooShort: "שם מלא חייב לכלול לפחות 2 תווים.",
  phoneRequired: "יש להזין מספר טלפון.",
  phoneInvalid: "מספר הטלפון לא תקין.",
  emailRequired: "יש להזין כתובת אימייל.",
  emailInvalid: "כתובת האימייל לא תקינה.",
  serviceTypeRequired: "יש לבחור נושא / סוג שירות.",
  privacyRequired: "יש לאשר את מדיניות הפרטיות כדי לשלוח את הטופס.",
  messageTooLong: "ההודעה ארוכה מדי.",
};

export function getContactValidationMessages(
  language: Language,
): ContactValidationMessages {
  return language === "he" ? he : en;
}
