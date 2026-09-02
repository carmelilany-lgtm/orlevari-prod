import {
  A11Y_STORAGE_KEY,
  DEFAULT_A11Y_PREFS,
  applyA11yPrefs,
  parseA11yPrefs,
  type A11yPrefs,
} from "@/lib/a11y/prefs";

let snapshot: A11yPrefs = DEFAULT_A11Y_PREFS;
let loaded = false;
const listeners = new Set<() => void>();

function readStoredPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return DEFAULT_A11Y_PREFS;
    return parseA11yPrefs(JSON.parse(raw)) ?? DEFAULT_A11Y_PREFS;
  } catch {
    return DEFAULT_A11Y_PREFS;
  }
}

function persist(prefs: A11yPrefs) {
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode */
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  snapshot = readStoredPrefs();
  loaded = true;
}

function emit(next: A11yPrefs) {
  snapshot = next;
  persist(next);
  if (typeof document !== "undefined") {
    applyA11yPrefs(next);
  }
  listeners.forEach((listener) => listener());
}

export function subscribeA11yPrefs(onStoreChange: () => void) {
  ensureLoaded();
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getA11yPrefsSnapshot(): A11yPrefs {
  ensureLoaded();
  return snapshot;
}

export function getA11yPrefsServerSnapshot(): A11yPrefs {
  return DEFAULT_A11Y_PREFS;
}

export function patchA11yPrefs(patch: Partial<Omit<A11yPrefs, "version">>) {
  ensureLoaded();
  emit({ ...snapshot, ...patch, version: 1 });
}

export function resetA11yPrefs() {
  emit({ ...DEFAULT_A11Y_PREFS });
}
