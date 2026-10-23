import type { CSSProperties } from "react";
import { X } from "lucide-react";
import { themeById } from "@/data/promo-themes";
import type { Promo } from "@/lib/promo";

const endsLabel = (endsOn: string) =>
  new Date(`${endsOn}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

// Fixed pattern (not random) so the server and the browser draw the same flakes.
const flakes = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 9 + ((i * 5) % 9),
  duration: 5 + ((i * 7) % 5),
  delay: -((i * 13) % 9),
  drift: (i % 2 ? 1 : -1) * (8 + ((i * 3) % 14)),
}));

// The scrolling offer strip. The website wraps it with a close button; the admin uses it for the preview.
export function PromoStrip({ promo, onClose }: { promo: Promo; onClose?: () => void }) {
  const theme = themeById(promo.theme);
  const message = promo.endsOn ? `${promo.text} · Ends ${endsLabel(promo.endsOn)}` : promo.text;

  return (
    <div
      role="region"
      aria-label="Special offer"
      className="relative z-[60] flex items-center border-b-2"
      style={{ background: theme.bg, color: theme.fg, borderBottomColor: theme.accent }}
    >
      <div className="marquee-mask min-w-0 flex-1 overflow-hidden py-2.5">
        <div className="marquee flex w-max text-xs font-semibold uppercase tracking-[0.16em]">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0" aria-hidden={group === 1}>
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i} className="whitespace-nowrap px-8">
                  {message}
                  <span className="px-8" style={{ color: theme.accent }}>
                    {theme.separator}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close offer"
          className="shrink-0 px-3 py-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {promo.snow && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0">
          {flakes.map((f, i) => (
            <span
              key={i}
              className="flake absolute top-0 select-none text-white"
              style={
                {
                  left: `${f.left}%`,
                  fontSize: `${f.size}px`,
                  "--dur": `${f.duration}s`,
                  "--delay": `${f.delay}s`,
                  "--drift": `${f.drift}px`,
                  textShadow: "0 0 4px rgba(0,0,0,0.35)",
                } as CSSProperties
              }
            >
              ❄
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
