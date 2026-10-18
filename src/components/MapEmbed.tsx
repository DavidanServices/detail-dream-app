import { MapPin } from "lucide-react";
import { mapsEmbedUrl, mapsUrl, site } from "@/data/site";

export function MapEmbed() {
  return (
    <div className="reveal overflow-hidden rounded-sm border border-border bg-card">
      <div className="relative">
        <iframe
          title={`Map showing ${site.name} at ${site.address.lines.join(", ")}`}
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-[360px] w-full border-0 [filter:grayscale(.25)] dark:[filter:invert(.92)_hue-rotate(180deg)_contrast(.9)] lg:h-[440px]"
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
