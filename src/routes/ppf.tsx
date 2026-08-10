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
  /** SVG path or rect definition for the top-down car diagram */
  d: string;
};

const PARTS: Part[] = [
  { id: "front-bumper", name: "Front bumper", price: 220, d: "M120 40 q80 -22 160 0 l6 34 q-86 -16 -172 0 z" },
  { id: "bonnet", name: "Bonnet / hood", price: 260, d: "M126 80 q74 -14 148 0 l8 78 q-82 -12 -164 0 z" },
  { id: "headlights", name: "Headlights", price: 60, d: "M124 48 l40 -8 l4 22 l-40 8 z M276 48 l-40 -8 l-4 22 l40 8 z" },
  { id: "front-wings", name: "Front wings", price: 180, d: "M112 84 l14 -2 l8 78 l-18 4 z M288 84 l-14 -2 l-8 78 l18 4 z" },
  { id: "mirrors", name: "Wing mirrors", price: 70, d: "M100 176 h20 v20 h-20 z M280 176 h20 v20 h-20 z" },
  { id: "windscreen-strip", name: "Windscreen strip", price: 90, d: "M118 164 q82 -12 164 0 l8 26 q-90 -12 -180 0 z" },
  { id: "front-doors", name: "Front doors", price: 200, d: "M110 194 l16 -2 v78 l-16 2 z M290 194 l-16 -2 v78 l16 2 z" },
  { id: "rear-doors", name: "Rear doors", price: 200, d: "M110 276 l16 -2 v76 l-16 2 z M290 276 l-16 -2 v76 l16 2 z" },
  { id: "roof", name: "Roof", price: 240, d: "M130 196 q70 -10 140 0 v150 q-70 -10 -140 0 z" },
  { id: "rear-quarters", name: "Rear quarter panels", price: 190, d: "M112 356 l16 -2 v66 l-18 -6 z M288 356 l-16 -2 v66 l18 -6 z" },
  { id: "boot", name: "Boot lid", price: 180, d: "M130 352 q70 -10 140 0 l6 58 q-76 -10 -152 0 z" },
  { id: "rear-bumper", name: "Rear bumper", price: 210, d: "M118 416 q82 -12 164 0 l-8 34 q-74 16 -148 0 z" },
  { id: "sills", name: "Side sills", price: 120, d: "M104 210 h10 v150 h-10 z M296 210 h-10 v150 h10 z" },
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
                viewBox="0 0 400 480"
                className="mx-auto h-auto w-full max-w-md select-none"
                role="img"
                aria-label="Interactive top-down car diagram for choosing paint protection film coverage"
              >
                {/* body outline */}
                <path
                  d="M200 24 q70 0 88 44 q16 46 16 176 q0 130 -16 190 q-18 42 -88 42 q-70 0 -88 -42 q-16 -60 -16 -190 q0 -130 16 -176 q18 -44 88 -44 z"
                  className="fill-secondary stroke-border"
                  strokeWidth={2}
                />
                {/* cabin glass hint */}
                <path
                  d="M130 190 q70 -12 140 0 v162 q-70 -12 -140 0 z"
                  className="fill-background/40"
                />
                {PARTS.map((part) => (
                  <g key={part.id}>
                    <path
                      d={part.d}
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
                            ? "fill-primary/25 stroke-primary/60"
                            : "fill-muted/40 stroke-border"
                      }`}
                      strokeWidth={1.5}
                    />
                  </g>
                ))}
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