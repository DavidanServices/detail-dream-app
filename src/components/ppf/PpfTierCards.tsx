import { ArrowRight, Check } from "lucide-react";
import { gbp, type VehicleTypeInfo } from "@/data/packages";
import type { PpfSettings } from "@/data/ppf";
import { stagger } from "@/lib/motion";

type Props = {
  ppf: PpfSettings;
  vehicleTypes: VehicleTypeInfo[];
  onChoose: (vehicleId: string) => void;
  disclaimer: string;
};

// One card per vehicle size. A size without a price shows "Request a quote".
export function PpfTierCards({ ppf, vehicleTypes, onChoose, disclaimer }: Props) {
  const tiers = ppf.tiers.filter((t) => vehicleTypes.some((v) => v.id === t.vehicleTypeId));
  const anyPrice = tiers.some((t) => t.price !== null);

  return (
    <>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const vehicle = vehicleTypes.find((v) => v.id === tier.vehicleTypeId);
          return (
            <article
              key={tier.vehicleTypeId}
              style={stagger(i)}
              className="reveal lift group flex flex-col rounded-sm border border-border bg-card p-7 hover:border-primary/50 sm:p-8"
            >
              <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>Package 0{i + 1}</span>
                <span className="text-primary">{vehicle?.label}</span>
              </p>
              <h3 className="mt-5 font-heading text-3xl text-card-foreground">{tier.title}</h3>
              {tier.blurb && <p className="mt-2 text-muted-foreground">{tier.blurb}</p>}

              {tier.price === null ? (
                <p className="mt-6 font-heading text-4xl leading-none text-foreground">
                  Request a quote
                </p>
              ) : (
                <>
                  <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    From
                  </p>
                  <p className="font-heading text-7xl leading-none text-foreground">
                    {gbp(tier.price)}
                  </p>
                </>
              )}

              <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                {ppf.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-[15px] leading-snug text-foreground sm:text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                onClick={() => onChoose(tier.vehicleTypeId)}
                aria-label={`Request a quote for ${tier.title}`}
                className="btn-primary mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground"
              >
                Request a quote{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          );
        })}
      </div>
      {anyPrice && (
        <p className="reveal mt-8 border-l-2 border-primary bg-primary/5 px-4 py-4 text-sm text-muted-foreground sm:text-base">
          {disclaimer}
        </p>
      )}
    </>
  );
}
