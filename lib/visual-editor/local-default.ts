/** Local `next dev` opens the visual editor by default. Production still requires admin + ?visualEdit=1. */
export function isLocalVisualEditorDefault(): boolean {
  return process.env.NODE_ENV === "development";
}
