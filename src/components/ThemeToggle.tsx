import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  // null until mounted: the server can't know the saved theme, so avoid a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(getTheme()), []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    const rect = e.currentTarget.getBoundingClientRect();
    applyTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`group relative inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary active:scale-90 ${className}`}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-500 ease-out group-hover:rotate-12 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ease-out group-hover:-rotate-12 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
    </button>
  );
}
