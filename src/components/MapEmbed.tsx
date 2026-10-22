import { MapPin } from "lucide-react";
import { useState } from "react";
import { mapsEmbedUrl, mapsUrl, site } from "@/data/site";

// The Google Map loads only after a click, so visitors who don't want Google contacted never trigger it
// (see the cookies section of the Privacy Policy).
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="reveal overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative h-[360px] w-full lg:h-[440px]">
        {loaded ? (
          <>
            <iframe
              title={`Map showing ${site.name} at ${site.address.lines.join(", ")}`}
              src={mapsEmbedUrl}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0 [filter:grayscale(.25)] dark:[filter:invert(.92)_hue-rotate(180deg)_contrast(.9)]"
            />
            {/* The embed centres on the address, so a red marker sits at the exact centre. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/40 [animation-duration:2.4s]" />
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(255,255,255,0.9)]" />
              <MapPin className="absolute bottom-1 left-1/2 h-12 w-12 -translate-x-1/2 fill-primary stroke-white drop-shadow-lg [stroke-width:1.5]" />
            </div>
          </>
        ) : (
          <div className="hairline-grid flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <MapPin className="h-7 w-7" />
            </span>
            <div>
              <p className="font-heading text-2xl text-foreground">{site.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {site.address.lines[0]}, {site.address.lines[1]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="btn-primary bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground"
            >
              Show map
            </button>
            <p className="max-w-sm text-xs text-muted-foreground">
              The map is provided by Google. It loads only when you press the button.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            {site.address.lines[0]}, {site.address.lines[1]}
          </span>
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="link-wipe text-xs font-semibold uppercase tracking-[0.14em] text-primary"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
