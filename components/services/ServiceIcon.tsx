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
        "M6.75 3v2.25M17.25 3v2.25M3 9.75h18M4.5 6.75h15A1.5 1.5 0 0 1 21 8.25v11.25A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5V8.25A1.5 1.5 0 0 1 4.5 6.75Z",
      )}
      {path("M9 13.5h.008v.008H9V13.5Zm3 0h.008v.008H12V13.5Zm3 0h.008v.008H15V13.5Z")}
    </IconSvg>
  );
}

function SocialIcon() {
  return (
    <IconSvg>
      {path(
        "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5A2.25 2.25 0 0 0 8.25 22.5h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
      )}
    </IconSvg>
  );
}

function ShowsIcon() {
  return (
    <IconSvg>
      {path(
        "M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z",
      )}
    </IconSvg>
  );
}

function DocumentaryIcon() {
  return (
    <IconSvg>
      {path(
        "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h4.886c.362 0 .705.173.918.459l2.122 3.292c.213.286.556.459.918.459h8.286c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125m-17.25 0h17.25",
      )}
    </IconSvg>
  );
}

function FamilyIcon() {
  return (
    <IconSvg>
      {path(
        "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
      )}
    </IconSvg>
  );
}

function MusicIcon() {
  return (
    <IconSvg>
      {path(
        "m9 9 10.5-3m-10.5 3v10.5l10.5-3V6M9 9 3.75 7.5M9 19.5v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V19.5",
      )}
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
