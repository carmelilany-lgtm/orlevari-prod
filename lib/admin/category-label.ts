/** Hebrew-primary labels for video categories in the admin UI. */

export function categoryAdminLabel(row: {
  title_he: string;
  title_en: string;
}): string {
  const he = row.title_he.trim();
  const en = row.title_en.trim();
  if (he && en) return `${he} (${en})`;
  return he || en || "—";
}

export function categoryAdminPrimary(row: {
  title_he: string;
  title_en: string;
}): string {
  return row.title_he.trim() || row.title_en.trim() || "—";
}

export function categoryAdminSecondary(row: {
  title_he: string;
  title_en: string;
}): string | null {
  const he = row.title_he.trim();
  const en = row.title_en.trim();
  if (he && en && en !== he) return en;
  return null;
}
