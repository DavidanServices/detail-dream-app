import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Shield, RotateCcw } from "lucide-react";
import frontImg from "@/assets/ppf-front.jpg";
import rearImg from "@/assets/ppf-rear.jpg";
import leftImg from "@/assets/ppf-left.jpg";
import rightImg from "@/assets/ppf-right.jpg";
import topImg from "@/assets/ppf-top.jpg";
import { gbp, ppfPackage } from "@/data/packages";
import { stagger } from "@/lib/motion";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/ppf")({
  head: () =>
    pageHead({
      title: "PPF Configurator — Build Your Coverage | Davidan Services",
      description:
        "Choose which panels you want protected with paint protection film using our interactive vehicle selector — front, rear, sides and roof.",
      ogTitle: "PPF Configurator — Davidan Services",
      ogDescription: "Pick the panels you want wrapped in self-healing paint protection film.",
      path: "/ppf",
    }),
  component: PpfPage,
});

type ViewId = "front" | "rear" | "left" | "right" | "top";

type Panel = { id: string; name: string; price: number };

const PANELS: Panel[] = [
  { id: "front-bumper", name: "Front bumper", price: 220 },
  { id: "rear-bumper", name: "Rear bumper", price: 210 },
  { id: "bonnet", name: "Bonnet", price: 260 },
  { id: "roof", name: "Roof", price: 240 },
  { id: "boot", name: "Boot", price: 180 },
  { id: "headlights", name: "Headlights", price: 60 },
  { id: "wing-l", name: "Left front wing", price: 95 },
  { id: "wing-r", name: "Right front wing", price: 95 },
  { id: "door-fl", name: "Left front door", price: 105 },
  { id: "door-fr", name: "Right front door", price: 105 },
  { id: "door-rl", name: "Left rear door", price: 100 },
  { id: "door-rr", name: "Right rear door", price: 100 },
  { id: "quarter-l", name: "Left rear quarter", price: 100 },
  { id: "quarter-r", name: "Right rear quarter", price: 100 },
  { id: "mirror-l", name: "Left wing mirror", price: 35 },
  { id: "mirror-r", name: "Right wing mirror", price: 35 },
];

const PANEL_BY_ID = Object.fromEntries(PANELS.map((p) => [p.id, p])) as Record<string, Panel>;

/** Hotspot polygons are in the natural 1280x832 image coordinate space. */
type Hotspot = { id: string; points: string };

const VIEWS: { id: ViewId; label: string; src: string; hotspots: Hotspot[] }[] = [
  {
    id: "front",
    label: "Front",
    src: frontImg,
    hotspots: [
      { id: "bonnet", points: "300,418 392,344 890,344 982,418 870,398 412,398" },
      { id: "front-bumper", points: "262,502 1020,502 1006,676 276,676" },
      { id: "headlights", points: "276,404 412,420 416,482 280,482 876,420 1006,404 1002,482 878,482" },
      { id: "roof", points: "432,172 850,172 862,198 420,198" },
      { id: "wing-r", points: "252,428 300,414 306,500 256,506" },
      { id: "wing-l", points: "982,414 1030,428 1026,506 976,500" },
      { id: "mirror-r", points: "256,282 346,286 346,332 258,326" },
      { id: "mirror-l", points: "936,286 1026,282 1024,326 938,332" },
    ],
  },
  {
    id: "rear",
    label: "Rear",
    src: rearImg,
    hotspots: [
      { id: "boot", points: "332,292 948,292 958,470 322,470" },
      { id: "rear-bumper", points: "216,482 1064,482 1048,700 232,700" },
      { id: "roof", points: "360,96 920,96 930,122 350,122" },
      { id: "quarter-l", points: "182,300 322,290 322,520 192,520" },
      { id: "quarter-r", points: "958,290 1098,300 1088,520 962,520" },
    ],
  },
  {
    id: "left",
    label: "Left",
    src: leftImg,
    hotspots: [
      { id: "front-bumper", points: "86,398 150,392 160,542 96,546" },
      { id: "headlights", points: "96,404 190,398 194,440 100,446" },
      { id: "wing-l", points: "152,388 402,374 420,530 162,542" },
      { id: "bonnet", points: "152,372 428,358 430,382 156,394" },
      { id: "door-fl", points: "424,378 690,374 690,546 430,550" },
      { id: "door-rl", points: "690,374 870,374 870,546 690,546" },
      { id: "quarter-l", points: "870,374 1088,380 1118,520 878,546" },
      { id: "rear-bumper", points: "1088,378 1200,400 1194,530 1110,524" },
      { id: "mirror-l", points: "470,338 532,334 536,366 474,370" },
      { id: "roof", points: "600,254 900,264 896,290 596,280" },
    ],
  },
  {
    id: "right",
    label: "Right",
    src: rightImg,
    hotspots: [
      { id: "front-bumper", points: "1180,418 1258,430 1252,560 1178,554" },
      { id: "headlights", points: "1174,420 1250,428 1244,462 1178,456" },
      { id: "wing-r", points: "940,398 1180,414 1174,560 944,554" },
      { id: "bonnet", points: "940,394 1180,410 1176,426 944,412" },
      { id: "door-fr", points: "600,394 936,400 940,560 604,564" },
      { id: "door-rr", points: "410,394 600,394 604,564 414,564" },
      { id: "quarter-r", points: "170,388 410,394 414,564 180,550" },
      { id: "rear-bumper", points: "32,400 170,388 180,550 42,544" },
      { id: "mirror-r", points: "790,338 856,344 850,376 788,370" },
      { id: "roof", points: "330,274 700,264 704,290 334,300" },
    ],
  },
  {
    id: "top",
    label: "Top",
    src: topImg,
    hotspots: [
      { id: "front-bumper", points: "96,300 160,250 166,590 100,546" },
      { id: "bonnet", points: "168,254 432,240 440,600 172,590" },
      { id: "roof", points: "600,268 812,268 816,572 600,572" },
      { id: "boot", points: "1000,264 1180,290 1174,560 1000,576" },
      { id: "rear-bumper", points: "1178,290 1216,332 1210,530 1176,560" },
      { id: "wing-r", points: "176,246 436,232 438,292 180,300" },
      { id: "wing-l", points: "180,556 438,566 436,630 176,620" },
      { id: "door-fr", points: "440,238 700,242 700,296 440,292" },
      { id: "door-rr", points: "700,242 962,250 960,300 700,296" },
      { id: "door-fl", points: "440,570 700,576 700,628 440,624" },
      { id: "door-rl", points: "700,576 962,570 960,620 700,628" },
      { id: "quarter-r", points: "962,250 1176,286 1174,318 960,300" },
      { id: "quarter-l", points: "960,568 1174,538 1176,566 962,618" },
      { id: "mirror-r", points: "504,174 556,166 560,214 508,220" },
      { id: "mirror-l", points: "500,600 552,598 550,656 498,652" },
    ],
  },
];

const FULL_CAR_PRICE = 1800;
const BASE_PRICE = ppfPackage.startingFrom;


function PpfPage() {
  const [view, setView] = useState<ViewId>("front");
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
    return BASE_PRICE + selected.reduce((sum, id) => sum + (PANEL_BY_ID[id]?.price ?? 0), 0);
  }, [selected, fullCar]);

  const summary = fullCar
    ? "Full car PPF"
    : PANELS.filter((p) => selected.includes(p.id))
        .map((p) => p.name)
        .join(", ");

  return (
    <>
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p style={stagger(0)} className="enter label-tech !text-primary">
            Paint Protection Film
          </p>
          <h1 style={stagger(1)} className="enter mt-4 font-heading text-6xl text-foreground sm:text-8xl lg:text-9xl">
            Build your PPF coverage
          </h1>
          <p style={stagger(2)} className="enter mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Rotate through each view and tap the panels you'd like protected — or wrap the whole car. Prices are
            indicative and confirmed after we see your vehicle.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Vehicle viewer */}
            <div className="reveal">
              <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={view === v.id}
                    className={`flex-1 rounded-lg px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-widest transition-all ${
                      view === v.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <div className="relative mt-4 overflow-hidden border border-border border-t-2 border-t-primary bg-card">
                <div className="relative aspect-[1280/832] w-full">
                  {VIEWS.map((v) => {
                    const active = v.id === view;
                    return (
                      <div
                        key={v.id}
                        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                          active ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                        aria-hidden={!active}
                      >
                        <img
                          src={v.src}
                          alt={`${v.label} view of the vehicle used to select paint protection film coverage`}
                          width={1280}
                          height={832}
                          loading={v.id === "front" ? "eager" : "lazy"}
                          className="h-full w-full object-cover"
                        />
                        <svg
                          viewBox="0 0 1280 832"
                          preserveAspectRatio="none"
                          className="absolute inset-0 h-full w-full"
                        >
                          <defs>
                            <linearGradient id="ppf-film" x1="0" y1="0" x2="0.8" y2="1">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
                              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
                              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
                            </linearGradient>
                          </defs>
                          {v.hotspots.map((h) => {
                            const on = isActive(h.id);
                            const hot = hovered === h.id;
                            return (
                              <polygon
                                key={`${v.id}-${h.id}`}
                                points={h.points}
                                fill={on ? "url(#ppf-film)" : hot ? "rgba(255,255,255,0.14)" : "transparent"}
                                stroke={
                                  on
                                    ? "rgba(255,255,255,0.75)"
                                    : hot
                                      ? "rgba(255,255,255,0.55)"
                                      : "transparent"
                                }
                                strokeWidth={on ? 2 : 1.5}
                                strokeLinejoin="round"
                                tabIndex={active ? 0 : -1}
                                role="button"
                                aria-pressed={on}
                                aria-label={`${PANEL_BY_ID[h.id]?.name}, ${gbp(PANEL_BY_ID[h.id]?.price ?? 0)}`}
                                onClick={() => toggle(h.id)}
                                onMouseEnter={() => setHovered(h.id)}
                                onMouseLeave={() => setHovered(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggle(h.id);
                                  }
                                }}
                                className="cursor-pointer outline-none transition-all duration-300"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {hovered && PANEL_BY_ID[hovered]
                  ? `${PANEL_BY_ID[hovered].name} — ${gbp(PANEL_BY_ID[hovered].price)}`
                  : "Hover or tap a panel to protect it. Selections are kept across every view."}
              </p>
            </div>

            {/* Panel list + summary */}
            <div style={stagger(2)} className="reveal">
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
                {PANELS.map((part) => (
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

              <div className="mt-8 border border-border border-t-2 border-t-primary bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {fullCar
                      ? "Full car coverage"
                      : `${selected.length} panel${selected.length === 1 ? "" : "s"} selected`}
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
                {!fullCar && selected.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {PANELS.filter((p) => selected.includes(p.id)).map((p) => (
                      <span
                        key={p.id}
                        className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-foreground"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                )}
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
                  className="glow-electric mt-6 inline-flex w-full items-center justify-center gap-2 glow-electric bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
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
