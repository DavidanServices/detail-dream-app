import { useEffect } from "react";

// Adds `.is-in` to every `.reveal` element the first time it scrolls into view.
// A MutationObserver picks up elements added by client-side navigation, because the router
// can commit the new URL before the new page's DOM exists.
export function RevealObserver() {
  useEffect(() => {
    const scan = (observe: (el: HTMLElement) => void) =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach(observe);

    if (!("IntersectionObserver" in window)) {
      const showAll = () => scan((el) => el.classList.add("is-in"));
      showAll();
      const fallback = new MutationObserver(showAll);
      fallback.observe(document.body, { childList: true, subtree: true });
      return () => fallback.disconnect();
    }

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const observe = (el: HTMLElement) => {
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    };

    scan(observe);
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => scan(observe));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
