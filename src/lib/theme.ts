export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

// Runs in <head> before first paint so the page never flashes the wrong theme.
// Dark is the brand default; a saved choice always wins.
export const themeInitScript = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.classList.toggle("dark",t==="dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

type Origin = { x: number; y: number };

function commit(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage can be blocked (private mode); the theme still applies for this visit
  }
}

// Switches theme with a circular reveal growing from `origin` (the toggle button).
// Uses the View Transitions API, which crossfades gradients and images too; browsers
// without it fall back to a CSS colour transition.
export function applyTheme(theme: Theme, origin?: Origin) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduceMotion) {
    root.classList.add("theme-transition");
    commit(theme);
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => commit(theme));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 700,
        easing: "cubic-bezier(.4,0,.2,1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}
