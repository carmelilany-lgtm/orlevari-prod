export const PRIVACY_CONSENT_KEY = "lev-ari-privacy-consent-v1";

export type PrivacyConsent = {
  version: 1;
  decided: boolean;
  analytics: boolean;
};

export const DEFAULT_PRIVACY_CONSENT: PrivacyConsent = {
  version: 1,
  decided: false,
  analytics: false,
};

export function parsePrivacyConsent(raw: unknown): PrivacyConsent | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<PrivacyConsent>;
  if (value.version !== 1) return null;
  return {
    version: 1,
    decided: value.decided === true,
    analytics: value.analytics === true,
  };
}
