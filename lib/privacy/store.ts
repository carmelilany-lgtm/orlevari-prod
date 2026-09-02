import {
  DEFAULT_PRIVACY_CONSENT,
  PRIVACY_CONSENT_KEY,
  parsePrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy/consent";

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
  try {
    localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  snapshot = readStored();
  loaded = true;
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
