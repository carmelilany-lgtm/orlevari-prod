import "server-only";

export interface ResendEnvConfig {
  apiKey: string | undefined;
  emailFrom: string | undefined;
  notificationEmail: string | undefined;
}

export function getResendEnv(): ResendEnvConfig {
  return {
    apiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    notificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL,
  };
}

export function isResendConfigured(): boolean {
  const { apiKey, emailFrom } = getResendEnv();
  return Boolean(apiKey?.trim() && emailFrom?.trim());
}

export function isNotificationEmailConfigured(): boolean {
  return Boolean(getResendEnv().notificationEmail?.trim());
}
