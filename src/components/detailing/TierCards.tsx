import { ArrowRight, Check, Info } from "lucide-react";
import type { Addon } from "@/data/addons";
import { gbp, type Package, type VehicleTypeInfo } from "@/data/packages";
import { stagger } from "@/lib/motion";

type Props = {
  pkg: Package;
  tiers: VehicleTypeInfo[];
  /** Card title per vehicle type id. */
  titleFor: (vehicle: VehicleTypeInfo) => string;
  blurbFor?: (vehicle: VehicleTypeInfo) => string | undefined;
  included: readonly string[];
  /** The optional extra the visitor switched on, so cards can show the combined starting price. */
  selectedAddon?: Addon | undefined;
  onChoose: (vehicleId: string) => void;
  disclaimer: string;
};

// One card per vehicle size, all with the same included services. Prices come from the catalogue.
export function TierCards({
  pkg,
  tiers,
  titleFor,
  blurbFor,
  included,
  selectedAddon,
  onChoose,
  disclaimer,
}: Props) {
  return (
    <>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((v, i) => {
          const price = pkg.prices[v.id] ?? 0;
          const title = titleFor(v);
          const blurb = blurbFor?.(v);
          return (
            <article
              key={v.id}
              style={stagger(i)}
              className="reveal lift group flex flex-col rounded-sm border border-border bg-card p-7 hover:border-primary/50 sm:p-8"
            >
              <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>Package 0{i + 1}</span>
                <span className="text-primary">{v.label}</span>
              </p>
              <h3 className="mt-5 font-heading text-3xl text-card-foreground">{title}</h3>
              <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted-foreground">From</p>
              <p className="font-heading text-7xl leading-none text-foreground">{gbp(price)}</p>
              {selectedAddon && (
                <p className="mt-2 text-sm text-primary">
                  With {selectedAddon.name.toLowerCase()}: from {gbp(price + selectedAddon.price)}
                </p>
              )}
              {blurb && <p className="mt-5 leading-relaxed text-muted-foreground">{blurb}</p>}

              <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                {included.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 text-[15px] leading-snug text-foreground sm:text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {text}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                onClick={() => onChoose(v.id)}
                aria-label={`Book ${title}`}
                className="btn-primary mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground"
              >
                Book {title.split(" ")[0]}{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          );
        })}
      </div>

      <p className="reveal mt-8 flex items-start gap-3 border-l-2 border-primary bg-primary/5 px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        {disclaimer}
      </p>
    </>
  );
}
