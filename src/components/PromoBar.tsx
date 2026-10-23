import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Promo } from "@/lib/promo";

const dismissedKey = (promo: Promo) => `promo-dismissed:${promo.text}`;

const endsLabel = (endsOn: string) =>
  new Date(`${endsOn}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

// Scrolling offer strip above the header. A visitor can close it; it stays closed for that browser session.
export function PromoBar({ promo }: { promo: Promo }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(dismissedKey(promo)) === "1");
    } catch {
      /* storage can be blocked */
    }
  }, [promo]);

  if (dismissed) return null;

  const close = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(dismissedKey(promo), "1");
    } catch {
      /* storage can be blocked */
    }
  };

  const message = promo.endsOn ? `${promo.text} · Ends ${endsLabel(promo.endsOn)}` : promo.text;

  return (
    <div
      role="region"
      aria-label="Special offer"
      className="relative flex items-center bg-primary text-primary-foreground"
    >
      <div className="marquee-mask min-w-0 flex-1 overflow-hidden py-2.5">
        <div className="marquee flex w-max text-xs font-semibold uppercase tracking-[0.16em]">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0" aria-hidden={group === 1}>
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="whitespace-nowrap px-8">
                  {message}
                  <span className="px-8 opacity-60">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Close offer"
        className="shrink-0 px-3 py-2 opacity-80 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
