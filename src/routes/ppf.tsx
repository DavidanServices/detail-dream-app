import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Shield, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/ppf")({
  head: () => ({
    meta: [
      { title: "PPF Configurator — Build Your Coverage | Luxe Auto Detail" },
      {
        name: "description",
        content:
          "Use our interactive car diagram to choose which panels you want protected with paint protection film, or select full-car coverage.",
      },
      { property: "og:title", content: "PPF Configurator — Luxe Auto Detail" },
      {
        property: "og:description",
        content: "Pick the panels you want wrapped in self-healing paint protection film.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ppf" }],
  }),
  component: PpfPage,
});

type Part = {
  id: string;
  name: string;
  price: number;
  /** SVG path for the 3/4 perspective car diagram */
  d: string;
  /** Panel orientation — drives the shading gradient */
  face?: "top" | "side" | "front" | "glass";
};

const PARTS: Part[] = [
  {
    id: "front-bumper",
    name: "Front bumper",
    price: 220,
    face: "front",
    d: "M97 226 C97 242 103 253 113 259 L165 223 C155 216 149 205 149 190 Z",
  },
  {
    id: "headlights",
    name: "Headlights",
    price: 60,
    face: "front",
    d: "M104 208 L127 192 L132 200 L109 216 Z M133 190 L154 175 L159 183 L138 198 Z",
  },
  {
    id: "bonnet",
    name: "Bonnet / hood",
    price: 260,
    face: "top",
    d: "M118 202 C136 199 176 197 268 196 L318 161 C232 162 194 164 168 167 Z",
  },
  {
    id: "windscreen-strip",
    name: "Windscreen",
    price: 90,
    face: "glass",
    d: "M268 196 L348 138 L398 103 L318 161 Z",
  },
  { id: "roof", name: "Roof", price: 240, face: "top", d: "M348 138 L486 134 L536 99 L398 103 Z" },
  {
    id: "front-wings",
    name: "Front wings",
    price: 180,
    face: "side",
    d: "M112 259 C102 252 97 241 97 226 C97 208 106 200 118 202 L236 197 L236 259 L214 259 A44 44 0 0 0 126 259 Z",
  },
  { id: "mirrors", name: "Wing mirrors", price: 70, face: "side", d: "M282 178 l26 -6 l6 13 l-26 6 z" },
  { id: "front-doors", name: "Front doors", price: 200, face: "side", d: "M236 197 L372 194 L372 256 L236 258 Z" },
  { id: "rear-doors", name: "Rear doors", price: 200, face: "side", d: "M372 194 L470 192 L470 254 L372 256 Z" },
  {
    id: "rear-quarters",
    name: "Rear quarter panels",
    price: 190,
    face: "side",
    d: "M470 192 L560 196 L592 200 L592 254 L549 254 A44 44 0 0 0 461 254 L470 254 Z",
  },
  { id: "boot", name: "Boot lid", price: 180, face: "top", d: "M560 196 L610 202 L660 167 L610 161 Z" },
  {
    id: "rear-bumper",
    name: "Rear bumper",
    price: 210,
    face: "side",
    d: "M592 200 L624 208 C632 224 632 242 624 252 L592 254 Z",
  },
  { id: "sills", name: "Side sills", price: 120, face: "side", d: "M214 246 L462 242 L462 258 L214 262 Z" },
];

const FULL_CAR_PRICE = 1800;
const BASE_PRICE = 350;

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

function PpfPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [fullCar, setFullCar] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const toggle = (id: string) => {
    setFullCar(false);
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const isActive = (id: string) => fullCar || selected.includes(id);

  const total = useMemo(() => {
    if (fullCar) return FULL_CAR_PRICE;
    if (selected.length === 0) return 0;
    return BASE_PRICE + PARTS.filter((p) => selected.includes(p.id)).reduce((sum, p) => sum + p.price, 0);
  }, [selected, fullCar]);

  const summary = fullCar
    ? "Full car PPF"
    : selected.length > 0
      ? PARTS.filter((p) => selected.includes(p.id))
          .map((p) => p.name)
          .join(", ")
      : "";

  return (
    <>
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
            Paint Protection Film
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Build your PPF coverage
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Tap the panels on the car you'd like protected — or wrap the whole thing. Prices are indicative and
            confirmed after we see your vehicle.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Diagram */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-8">
              <svg
                viewBox="72 82 616 216"
                className="mx-auto h-auto w-full select-none"
                role="img"
                aria-label="Interactive three-quarter view car diagram for choosing paint protection film coverage"
              >
                <defs>
                  <linearGradient id="ppf-top" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor="var(--snow)" />
                    <stop offset="100%" stopColor="var(--steel)" />
                  </linearGradient>
                  <linearGradient id="ppf-side" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--steel)" />
                    <stop offset="55%" stopColor="var(--snow)" />
                    <stop offset="100%" stopColor="var(--charcoal)" />
                  </linearGradient>
                  <linearGradient id="ppf-front" x1="0" y1="0" x2="0.4" y2="1">
                    <stop offset="0%" stopColor="var(--steel)" />
                    <stop offset="100%" stopColor="var(--charcoal)" />
                  </linearGradient>
                  <linearGradient id="ppf-glass" x1="0" y1="0" x2="0.6" y2="1">
                    <stop offset="0%" stopColor="var(--charcoal)" />
                    <stop offset="100%" stopColor="var(--steel)" />
                  </linearGradient>
                  <radialGradient id="ppf-shadow">
                    <stop offset="0%" stopColor="var(--charcoal)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--charcoal)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* ground shadow */}
                <ellipse cx="350" cy="278" rx="270" ry="24" fill="url(#ppf-shadow)" />

                {/* far-side wheels */}
                <ellipse cx="150" cy="234" rx="24" ry="22" className="fill-charcoal-dark" />
                <ellipse cx="452" cy="228" rx="24" ry="22" className="fill-charcoal-dark" />

                {/* body shell beneath the panels */}
                <path
                  d="M56 209 L62 189 L78 181 L193 166 L268 114 L393 112 L458 154 L526 162 L536 190 L598 214 L590 248 L560 258 L150 260 L66 250 Z"
                  fill="url(#ppf-side)"
                  className="stroke-border"
                  strokeWidth={1}
                  strokeLinejoin="round"
                />

                {/* side glass + Hofmeister kink */}
                <path d="M340 140 L448 138 L512 176 L344 182 Z" fill="url(#ppf-glass)" opacity="0.9" />
                <path d="M470 140 L512 176 L492 178 L452 141 Z" className="fill-charcoal-dark" opacity="0.7" />

                {PARTS.map((part) => (
                  <g key={part.id}>
                    <path
                      d={part.d}
                      fill={
                        isActive(part.id) || hovered === part.id
                          ? undefined
                          : `url(#ppf-${part.face === "glass" ? "glass" : (part.face ?? "side")})`
                      }
                      onClick={() => toggle(part.id)}
                      onMouseEnter={() => setHovered(part.id)}
                      onMouseLeave={() => setHovered(null)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isActive(part.id)}
                      aria-label={`${part.name}, ${gbp(part.price)}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(part.id);
                        }
                      }}
                      className={`cursor-pointer outline-none transition-all duration-200 ${
                        isActive(part.id)
                          ? "fill-primary stroke-primary"
                          : hovered === part.id
                            ? "fill-primary/45 stroke-primary"
                            : "stroke-border/80"
                      }`}
                      strokeWidth={1.25}
                      strokeLinejoin="round"
                    />
                  </g>
                ))}

                {/* BMW kidney grille */}
                <path d="M106 224 L122 216 L114 197 L98 204 Z" className="fill-charcoal-dark" opacity="0.9" />
                <path d="M88 217 L104 209 L96 190 L80 197 Z" className="fill-charcoal-dark" opacity="0.9" />
                <path
                  d="M106 224 L122 216 L114 197 L98 204 Z M88 217 L104 209 L96 190 L80 197 Z"
                  fill="none"
                  className="stroke-steel"
                  strokeWidth={1.5}
                />

                {/* roundel badge on the bonnet */}
                <g transform="translate(150,190) rotate(-8) scale(1,0.42)">
                  <circle r="9" className="fill-charcoal-dark" />
                  <circle r="6.5" className="fill-snow" />
                  <path d="M0 -6.5 A6.5 6.5 0 0 1 6.5 0 L0 0 Z" className="fill-primary/70" />
                  <path d="M0 6.5 A6.5 6.5 0 0 1 -6.5 0 L0 0 Z" className="fill-primary/70" />
                </g>

                {/* near-side wheels */}
                <g>
                  <ellipse cx="205" cy="248" rx="34" ry="32" className="fill-charcoal-dark" />
                  <ellipse cx="205" cy="248" rx="19" ry="18" className="fill-steel" />
                  <ellipse cx="205" cy="248" rx="7" ry="6.5" className="fill-charcoal" />
                  <ellipse cx="505" cy="244" rx="34" ry="32" className="fill-charcoal-dark" />
                  <ellipse cx="505" cy="244" rx="19" ry="18" className="fill-steel" />
                  <ellipse cx="505" cy="244" rx="7" ry="6.5" className="fill-charcoal" />
                </g>

                {/* shoulder crease + door shut lines */}
                <path
                  d="M140 206 L225 200 L350 196 L460 196 L588 202"
                  fill="none"
                  className="stroke-charcoal/25"
                  strokeWidth={1.5}
                />
              </svg>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {hovered
                  ? `${PARTS.find((p) => p.id === hovered)?.name} — ${gbp(PARTS.find((p) => p.id === hovered)!.price)}`
                  : "Hover or tap a panel to select it"}
              </p>
            </div>

            {/* Panel list + summary */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setFullCar((v) => !v);
                  setSelected([]);
                }}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-all ${
                  fullCar
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>
                    <span className="block font-heading font-semibold text-card-foreground">Full car PPF</span>
                    <span className="block text-sm text-muted-foreground">
                      Every painted panel wrapped, edge-to-edge
                    </span>
                  </span>
                </span>
                <span className="font-heading text-xl font-bold text-foreground">{gbp(FULL_CAR_PRICE)}</span>
              </button>

              <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Or pick individual panels</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {PARTS.map((part) => (
                  <li key={part.id}>
                    <button
                      type="button"
                      onClick={() => toggle(part.id)}
                      onMouseEnter={() => setHovered(part.id)}
                      onMouseLeave={() => setHovered(null)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                        isActive(part.id)
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isActive(part.id) ? "border-primary bg-primary" : "border-border"
                          }`}
                        >
                          {isActive(part.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                        </span>
                        {part.name}
                      </span>
                      <span className="font-medium text-foreground">{gbp(part.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {fullCar ? "Full car coverage" : `${selected.length} panel${selected.length === 1 ? "" : "s"} selected`}
                  </span>
                  {(fullCar || selected.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFullCar(false);
                        setSelected([]);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </button>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold text-foreground">
                    {total > 0 ? gbp(total) : gbp(BASE_PRICE)}
                  </span>
                  <span className="text-muted-foreground">{total > 0 ? "estimate" : "starting from"}</span>
                </div>
                {!fullCar && selected.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Includes {gbp(BASE_PRICE)} installation base + selected panels.
                  </p>
                )}
                <Link
                  to="/contact"
                  search={{
                    service: "Paint Protection Film",
                    coverage: summary || undefined,
                  }}
                  className="glow-electric mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Request quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}