export const THEME_COLORS = {
  light: "#13294b",
  dark: "#11110f",
} as const;

export type ThemeName = "light" | "dark";

export function resolveTheme(stored = localStorage.getItem("theme")): ThemeName {
  if (stored === "dark" || stored === "light") return stored;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ThemeName = resolveTheme(), doc: Document = document) {
  doc.documentElement.dataset.theme = theme;
  const meta = doc.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

export function persistTheme(theme: ThemeName) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}
