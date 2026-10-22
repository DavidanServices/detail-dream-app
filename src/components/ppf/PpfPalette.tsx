import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { finishLabels, type PpfColor, type PpfFinish } from "@/data/ppf";
import { stagger } from "@/lib/motion";

type Props = {
  colors: PpfColor[];
  selectedId?: string | undefined;
  onSelect: (color: PpfColor) => void;
};

// Sheen on top of the flat colour so each swatch reads as gloss, satin or matte film.
const sheen: Record<PpfFinish, string> = {
  gloss: "bg-gradient-to-br from-white/35 via-transparent to-black/35",
  satin: "bg-gradient-to-br from-white/15 via-transparent to-black/25",
  matte: "bg-gradient-to-br from-white/5 via-transparent to-black/15",
};

// Colour palette for presentation: filter by finish, tap a swatch to mention it in the quote request.
export function PpfPalette({ colors, selectedId, onSelect }: Props) {
  const [finish, setFinish] = useState<PpfFinish | "all">("all");
  const finishes = useMemo(
    () => (["gloss", "satin", "matte"] as const).filter((f) => colors.some((c) => c.finish === f)),
    [colors],
  );
  const shown = colors.filter((c) => finish === "all" || c.finish === finish);

  return (
    <div>
      {finishes.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by finish">
          {(["all", ...finishes] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFinish(f)}
              aria-pressed={finish === f}
              className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                finish === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : finishLabels[f]}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {shown.map((color, i) => {
          const selected = color.id === selectedId;
          return (
            <li key={color.id} style={stagger(i % 6)} className="reveal">
              <button
                type="button"
                onClick={() => onSelect(color)}
                aria-pressed={selected}
                aria-label={`${color.name}, ${finishLabels[color.finish]} finish`}
                className={`group block w-full text-left outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 ${
                  selected ? "-translate-y-1" : ""
                }`}
              >
                <span
                  className={`relative block aspect-[4/3] overflow-hidden rounded-sm border transition-all duration-300 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring ${
                    selected ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className={`absolute inset-0 ${sheen[color.finish]}`} />
                  <span className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {color.hex}
                  </span>
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </span>
                <span className="mt-3 block font-heading text-lg uppercase tracking-wide text-foreground">
                  {color.name}
                </span>
                <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {finishLabels[color.finish]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
