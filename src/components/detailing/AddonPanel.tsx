import { Check, Plus } from "lucide-react";
import { addonPriceLabel, type Addon } from "@/data/addons";

type Props = {
  addon: Addon;
  selected: boolean;
  onToggle: () => void;
  /** e.g. "Add it to any interior package." */
  hint: string;
};

// Visually distinct optional extra with an add-to-booking toggle.
export function AddonPanel({ addon, selected, onToggle, hint }: Props) {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden border border-primary/60 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">Optional extra</p>
              <h2 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl">
                {addon.name}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {addon.description}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{hint}</p>
            </div>
            <div className="lg:text-right">
              <p className="font-heading text-7xl leading-none text-primary">
                {addonPriceLabel(addon)}
              </p>
              {addon.note && (
                <p className="mt-2 text-sm text-muted-foreground">({addon.note.toLowerCase()})</p>
              )}
              <button
                type="button"
                aria-pressed={selected}
                onClick={onToggle}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 border px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98] sm:w-auto ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary text-primary hover:bg-primary/10"
                }`}
              >
                {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {selected ? "Added to my booking" : "Add to my booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
