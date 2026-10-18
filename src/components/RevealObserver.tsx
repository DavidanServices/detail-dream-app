import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Adds `.is-in` to every `.reveal` element the first time it scrolls into view.
export function RevealObserver() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
