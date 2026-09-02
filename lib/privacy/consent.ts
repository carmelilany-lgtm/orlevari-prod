export const PRIVACY_CONSENT_KEY = "lev-ari-privacy-consent-v1";
export const PRIVACY_BANNER_ID = "privacy-consent-banner";
export const PRIVACY_DECIDED_ATTR = "data-privacy-decided";

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

export function parsePrivacyConsentText(raw: string | undefined | null): PrivacyConsent | null {
  if (!raw?.trim()) return null;
  try {
    return parsePrivacyConsent(JSON.parse(raw));
  } catch {
    try {
      return parsePrivacyConsent(JSON.parse(decodeURIComponent(raw)));
    } catch {
      return null;
    }
  }
}

/** Hide the banner before paint if this browser already chose. */
export const PRIVACY_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(PRIVACY_CONSENT_KEY)};var raw=null;try{raw=localStorage.getItem(k)}catch(e){}if(!raw){var p=k+"=";var c=document.cookie.split("; ").find(function(x){return x.indexOf(p)===0});if(c)raw=decodeURIComponent(c.slice(p.length))}if(!raw)return;var v=JSON.parse(raw);if(v.version===1&&v.decided===true){document.documentElement.setAttribute(${JSON.stringify(PRIVACY_DECIDED_ATTR)},"1")}}catch(e){}})();`;
