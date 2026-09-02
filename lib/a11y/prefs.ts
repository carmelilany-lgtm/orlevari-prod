export const A11Y_STORAGE_KEY = "lev-ari-a11y-prefs-v1";
export const A11Y_WIDGET_ID = "a11y-widget-panel";
export const A11Y_TRIGGER_ID = "a11y-widget-trigger";

export type A11yTextSize = 100 | 115 | 130 | 150;
export type A11yContrast = "off" | "high" | "invert";
export type A11yLineSpacing = "normal" | "relaxed" | "loose";

export type A11yPrefs = {
  version: 1;
  textSize: A11yTextSize;
  contrast: A11yContrast;
  lineSpacing: A11yLineSpacing;
  highlightLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
};

export const DEFAULT_A11Y_PREFS: A11yPrefs = {
  version: 1,
  textSize: 100,
  contrast: "off",
  lineSpacing: "normal",
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false,
};

const TEXT_SIZES: A11yTextSize[] = [100, 115, 130, 150];
const CONTRASTS: A11yContrast[] = ["off", "high", "invert"];
const SPACINGS: A11yLineSpacing[] = ["normal", "relaxed", "loose"];

export const CLASS_RULES: {
  className: string;
  match: (prefs: A11yPrefs) => boolean;
  js: string;
}[] = [
  { className: "a11y-links", match: (p) => p.highlightLinks, js: "!!p.highlightLinks" },
  {
    className: "a11y-contrast-high",
    match: (p) => p.contrast === "high",
    js: "p.contrast==='high'",
  },
  {
    className: "a11y-contrast-invert",
    match: (p) => p.contrast === "invert",
    js: "p.contrast==='invert'",
  },
  { className: "a11y-text-115", match: (p) => p.textSize === 115, js: "p.textSize===115" },
  { className: "a11y-text-130", match: (p) => p.textSize === 130, js: "p.textSize===130" },
  { className: "a11y-text-150", match: (p) => p.textSize === 150, js: "p.textSize===150" },
  {
    className: "a11y-lines-relaxed",
    match: (p) => p.lineSpacing === "relaxed",
    js: "p.lineSpacing==='relaxed'",
  },
  {
    className: "a11y-lines-loose",
    match: (p) => p.lineSpacing === "loose",
    js: "p.lineSpacing==='loose'",
  },
  { className: "a11y-readable-font", match: (p) => p.readableFont, js: "!!p.readableFont" },
  { className: "a11y-reduce-motion", match: (p) => p.reduceMotion, js: "!!p.reduceMotion" },
];

export function parseA11yPrefs(raw: unknown): A11yPrefs | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<A11yPrefs>;
  if (value.version !== 1) return null;
  return {
    version: 1,
    textSize: TEXT_SIZES.includes(value.textSize as A11yTextSize)
      ? (value.textSize as A11yTextSize)
      : 100,
    contrast: CONTRASTS.includes(value.contrast as A11yContrast)
      ? (value.contrast as A11yContrast)
      : "off",
    lineSpacing: SPACINGS.includes(value.lineSpacing as A11yLineSpacing)
      ? (value.lineSpacing as A11yLineSpacing)
      : "normal",
    highlightLinks: value.highlightLinks === true,
    readableFont: value.readableFont === true,
    reduceMotion: value.reduceMotion === true,
  };
}

export function applyA11yPrefs(
  prefs: A11yPrefs,
  target: HTMLElement = document.documentElement,
) {
  const classes = target.classList;
  for (const rule of CLASS_RULES) {
    classes.toggle(rule.className, rule.match(prefs));
  }
}

export function cycleTextSize(current: A11yTextSize): A11yTextSize {
  return TEXT_SIZES[(TEXT_SIZES.indexOf(current) + 1) % TEXT_SIZES.length];
}

export function cycleContrast(current: A11yContrast): A11yContrast {
  return CONTRASTS[(CONTRASTS.indexOf(current) + 1) % CONTRASTS.length];
}

export function cycleLineSpacing(current: A11yLineSpacing): A11yLineSpacing {
  return SPACINGS[(SPACINGS.indexOf(current) + 1) % SPACINGS.length];
}

export const A11Y_BOOTSTRAP_SCRIPT = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(A11Y_STORAGE_KEY)});if(!raw)return;var p=JSON.parse(raw);if(p.version!==1)return;var c=document.documentElement.classList;${CLASS_RULES.map((rule) => `c.toggle(${JSON.stringify(rule.className)},${rule.js})`).join(";")}}catch(e){}})();`;
