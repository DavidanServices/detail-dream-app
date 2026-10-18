import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { lowestPrice, vehicleTypes, type Package, type VehicleType } from "@/data/packages";

export function PackageCard({ pkg }: { pkg: Package }) {
  const [open, setOpen] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleType>("hatchback");
  const vehicleLabel = vehicleTypes.find((v) => v.id === vehicle)!.label;
  const lowest = lowestPrice(pkg);

  return (
    <div
      className={`lift relative flex flex-col rounded-2xl border bg-card p-6 hover:border-primary/30 hover:bg-muted ${pkg.popular ? "border-primary/50 ring-1 ring-primary/20" : "border-border"}`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      )}
      <h3 className="font-heading text-xl font-semibold text-card-foreground">{pkg.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>

      <div className="mt-4 h-[52px] overflow-hidden">
        <div
          key={open ? vehicle : "base"}
          className="flex items-baseline gap-2 duration-500 animate-in fade-in slide-in-from-bottom-3"
        >
          <span className="font-heading text-4xl font-bold text-foreground">
            £{open ? pkg.prices[vehicle] : lowest}
          </span>
          <span className="text-sm text-muted-foreground">
            {open ? vehicleLabel : "starting from"}
          </span>
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-out ${open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your vehicle type
          </p>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setVehicle(type.id)}
                aria-pressed={vehicle === type.id}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                  vehicle === type.id
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {open ? (
        <Link
          to="/contact"
          search={{ service: pkg.name, vehicle: vehicleLabel }}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 glow-electric bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Book Now <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 glow-electric bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Choose your vehicle <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
