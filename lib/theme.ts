export type Theme = "light" | "dark";

/** The visitor's explicit choice. Absent means "follow the system". */
export const THEME_KEY = "watermelon-mbti:theme";

/** Stored choice if there is one, otherwise the system preference. */
export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage blocked (private mode, policy): fall through to the system.
  }
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The same resolution as an inline script for the root layout. It runs while
 * the HTML is parsed, before the first paint, so a dark-mode visitor never
 * sees a flash of the light theme. Kept in sync with resolveTheme by hand:
 * it has to be a self-contained string.
 */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
