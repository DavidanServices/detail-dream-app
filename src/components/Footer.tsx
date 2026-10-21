import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { serviceLink, services } from "@/data/services";
import { mapsUrl, site, telHref, whatsappUrl } from "@/data/site";

const explore = [
  { to: "/exterior-detailing", label: "Exterior packages" },
  { to: "/interior-detailing", label: "Interior packages" },
  { to: "/ppf", label: "PPF configurator" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const legal = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of service" },
] as const;

const socialIcons = { Instagram, Facebook } as const;

const linkClass = "link-wipe text-muted-foreground transition-colors hover:text-foreground";
const rowClass = "flex items-start gap-3 transition-colors hover:text-foreground";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <Link to="/contact" className="group block border-b border-border">
        <div className="reveal mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-5 font-heading text-5xl sm:text-6xl lg:text-7xl">
              Book your <span className="text-primary">detail</span>
            </h2>
          </div>
          <ArrowUpRight className="h-12 w-12 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 sm:h-16 sm:w-16" />
        </div>
      </Link>

      {/* Four equal columns on desktop, two by two on tablet, stacked on mobile */}
      <div className="reveal mx-auto grid max-w-7xl gap-x-10 gap-y-12 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="inline-block">
            <img
              src="/logo.png"
              alt={`${site.name} logo`}
              className="h-16 w-auto transition-transform duration-300 hover:scale-105"
              width={512}
              height={200}
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Premium auto detailing that protects, restores and elevates your vehicle&apos;s finish.
          </p>
          {site.social.length > 0 && (
            <div className="mt-6 flex gap-3">
              {site.social.map((item) => {
                const Icon = socialIcons[item.name];
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="border border-border p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary active:scale-90"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Services</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link {...serviceLink(s.id)} className={linkClass}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                search={{ service: "Not sure" }}
                className={`${linkClass} !text-primary`}
              >
                Request a quote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            <li>
              <a href={telHref} className={rowClass}>
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className={rowClass}>
                <WhatsappIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${rowClass} break-all`}>
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.email}
              </a>
            </li>
            <li>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={rowClass}>
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {site.address.lines[0]}
                  <br />
                  {site.address.lines[1]}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 pb-24 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-6 sm:pr-24 lg:px-8 lg:pr-28">
          <p>
            © {currentYear} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
