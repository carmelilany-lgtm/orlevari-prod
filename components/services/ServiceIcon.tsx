"use client";

import type { ReactNode } from "react";

const iconClass = "h-6 w-6";

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      className={iconClass}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function path(d: string) {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d={d}
    />
  );
}

function EventsIcon() {
  return (
    <IconSvg>
      {path(
        "M6.75 7.2h10.5A1.8 1.8 0 0 1 19.05 9v8.55a1.8 1.8 0 0 1-1.8 1.8H6.75a1.8 1.8 0 0 1-1.8-1.8V9a1.8 1.8 0 0 1 1.8-1.8Z",
      )}
      {path(
        "M9.15 7.2V5.85A1.35 1.35 0 0 1 10.5 4.5h3a1.35 1.35 0 0 1 1.35 1.35V7.2",
      )}
      {path("M12 16.2a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z")}
      {path("M16.8 10.05h.008v.008H16.8V10.05Z")}
    </IconSvg>
  );
}

function SocialIcon() {
  return (
    <IconSvg>
      {path(
        "M8.25 3.75h7.5A1.5 1.5 0 0 1 17.25 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z",
      )}
      {path("M11.25 17.25h1.5")}
    </IconSvg>
  );
}

function ShowsIcon() {
  return (
    <IconSvg>
      {path(
        "M12 15.75a3 3 0 0 1-3-3V6a3 3 0 1 1 6 0v6.75a3 3 0 0 1-3 3Z",
      )}
      {path("M6.75 10.5v2.25a5.25 5.25 0 0 0 10.5 0V10.5")}
      {path("M12 18v2.25m-2.25 0h4.5")}
    </IconSvg>
  );
}

function DocumentaryIcon() {
  return (
    <IconSvg>
      {path(
        "M3.75 8.25h10.5A1.5 1.5 0 0 1 15.75 9.75v7.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Z",
      )}
      {path(
        "M15.75 11.25 20.1 8.4a.75.75 0 0 1 1.15.63v8.94a.75.75 0 0 1-1.15.63l-4.35-2.85",
      )}
      {path("M6.75 8.25V6.3A1.05 1.05 0 0 1 7.8 5.25h4.4A1.05 1.05 0 0 1 13.25 6.3v1.95")}
    </IconSvg>
  );
}

function FamilyIcon() {
  return (
    <IconSvg>
      {path("M7.25 8a2.15 2.15 0 1 0 0-4.3A2.15 2.15 0 0 0 7.25 8Z")}
      {path("M16.75 8a2.15 2.15 0 1 0 0-4.3A2.15 2.15 0 0 0 16.75 8Z")}
      {path("M12 12.35a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z")}
      {path("M3.6 18.75v-1.35A3.5 3.5 0 0 1 7.1 13.9h.5")}
      {path("M20.4 18.75v-1.35a3.5 3.5 0 0 0-3.5-3.5h-.5")}
      {path("M8.7 18.75v-1.1A3.3 3.3 0 0 1 12 14.4a3.3 3.3 0 0 1 3.3 3.25v1.1")}
    </IconSvg>
  );
}

function MusicIcon() {
  return (
    <IconSvg>
      {path("M9 18.75a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z")}
      {path("M11.4 16.35V5.1L19.5 3.3v9.3")}
      {path("M19.5 14.85a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z")}
    </IconSvg>
  );
}

function DefaultFilmIcon() {
  return (
    <IconSvg>
      {path(
        "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z",
      )}
    </IconSvg>
  );
}

const ICONS: Record<string, () => ReactNode> = {
  events: EventsIcon,
  event: EventsIcon,
  wedding: EventsIcon,
  social: SocialIcon,
  "social-media": SocialIcon,
  "social-media-production": SocialIcon,
  shows: ShowsIcon,
  live: ShowsIcon,
  stage: ShowsIcon,
  documentary: DocumentaryIcon,
  family: FamilyIcon,
  "family-films": FamilyIcon,
  "music-videos": MusicIcon,
  music: MusicIcon,
  clip: MusicIcon,
  video: DefaultFilmIcon,
  film: DefaultFilmIcon,
};

function normalizeIconKey(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-");
}

function inferKeyFromTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (/(event|wedding|אירוע|חתונ)/.test(t)) return "events";
  if (/(social|סושיאל|רשת)/.test(t)) return "social";
  if (/(show|stage|live|הופע|במה)/.test(t)) return "shows";
  if (/(document|דוקו)/.test(t)) return "documentary";
  if (/(family|משפח)/.test(t)) return "family";
  if (/(music|clip|קליפ|מוזיק)/.test(t)) return "music-videos";
  return null;
}

export function ServiceIcon({
  iconKey,
  serviceId,
  title,
}: {
  iconKey?: string;
  serviceId: string;
  title?: string;
}) {
  const fromKey = iconKey ? normalizeIconKey(iconKey) : "";
  const fromId = normalizeIconKey(serviceId);
  const fromTitle = title ? inferKeyFromTitle(title) : null;
  const key =
    (fromKey && ICONS[fromKey] ? fromKey : null) ??
    (ICONS[fromId] ? fromId : null) ??
    fromTitle ??
    "film";
  const Icon = ICONS[key] ?? DefaultFilmIcon;
  return <Icon />;
}
