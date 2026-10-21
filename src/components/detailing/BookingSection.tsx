import type { Addon } from "@/data/addons";
import type { Package, VehicleTypeInfo } from "@/data/packages";
import type { PpfSettings } from "@/data/ppf";
import { mapsUrl, site, telHref, whatsappUrl } from "@/data/site";
import { QuoteForm, type QuotePreset } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";

type Props = {
  packages: Package[];
  ppf: PpfSettings;
  vehicleTypes: VehicleTypeInfo[];
  addons: Addon[];
  preset: QuotePreset;
};

export function BookingSection({ packages, ppf, vehicleTypes, addons, preset }: Props) {
  return (
    <section id="book" className="scroll-mt-20 border-t border-border bg-secondary py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Book your detail"
            title="Request a quote"
            lead="Tell us about your vehicle and we'll come back with availability and a clear price. No obligation."
          />
          <ul className="reveal mt-8 space-y-3 text-muted-foreground">
            <li>
              Call{" "}
              <a
                href={telHref}
                className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Message us on WhatsApp
              </a>
            </li>
            <li>
              {site.address.lines[0]}, {site.address.lines[1]} ·{" "}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Directions
              </a>
            </li>
          </ul>
        </div>
        <div className="reveal border border-border border-t-2 border-t-primary bg-card p-6 sm:p-8">
          <QuoteForm
            packages={packages}
            ppf={ppf}
            vehicleTypes={vehicleTypes}
            addons={addons}
            preset={preset}
          />
        </div>
      </div>
    </section>
  );
}
