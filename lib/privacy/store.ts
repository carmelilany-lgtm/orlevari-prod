import {
  DEFAULT_PRIVACY_CONSENT,
  PRIVACY_CONSENT_KEY,
  PRIVACY_DECIDED_ATTR,
  parsePrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy/consent";

const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

let snapshot: PrivacyConsent = DEFAULT_PRIVACY_CONSENT;
let loaded = false;
const listeners = new Set<() => void>();

function readStored(): PrivacyConsent {
  try {
    const raw = localStorage.getItem(PRIVACY_CONSENT_KEY);
    if (!raw) return DEFAULT_PRIVACY_CONSENT;
    return parsePrivacyConsent(JSON.parse(raw)) ?? DEFAULT_PRIVACY_CONSENT;
  } catch {
    return DEFAULT_PRIVACY_CONSENT;
  }
}

function persist(next: PrivacyConsent) {
  const encoded = JSON.stringify(next);
  try {
    localStorage.setItem(PRIVACY_CONSENT_KEY, encoded);
  } catch {
    /* private mode */
  }
  if (typeof document === "undefined") return;
  try {
    if (next.decided) {
      document.documentElement.setAttribute(PRIVACY_DECIDED_ATTR, "1");
      document.cookie = `${PRIVACY_CONSENT_KEY}=${encodeURIComponent(encoded)}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`;
    } else {
      document.documentElement.removeAttribute(PRIVACY_DECIDED_ATTR);
      document.cookie = `${PRIVACY_CONSENT_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  } catch {
    /* private mode */
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  snapshot = readStored();
  loaded = true;
  if (snapshot.decided) persist(snapshot);
}

function emit(next: PrivacyConsent) {
  snapshot = next;
  persist(next);
  listeners.forEach((listener) => listener());
}

export function subscribePrivacyConsent(onStoreChange: () => void) {
  ensureLoaded();
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getPrivacyConsentSnapshot(): PrivacyConsent {
  ensureLoaded();
  return snapshot;
}

export function getPrivacyConsentServerSnapshot(): PrivacyConsent {
  return DEFAULT_PRIVACY_CONSENT;
}

export function setPrivacyConsent(analytics: boolean) {
  emit({ version: 1, decided: true, analytics });
}
