import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import logoAsset from "../assets/davidan-logo.png.asset.json";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <Link to="/contact" className="group block border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-4 py-14 sm:px-8">
          <h2 className="font-heading text-6xl font-black sm:text-8xl lg:text-[9rem]">
            Book your <span className="text-primary">detail</span>
          </h2>
          <ArrowUpRight className="h-14 w-14 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 sm:h-24 sm:w-24" />
        </div>
      </Link>
      <div className="mx-auto grid max-w-[1440px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary p-8">
          <Link to="/" className="inline-block">
            <img src={logoAsset.url} alt="Davidan Services logo" className="h-14 w-auto" width={841} height={280} />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Premium auto detailing services that protect, restore, and elevate your vehicle's finish.
          </p>
        </div>
        <div className="bg-secondary p-8">
          <h3 className="label-tech">Quick Links</h3>
          <ul className="mt-4 space-y-2 font-heading text-2xl font-bold uppercase">
            <li><Link to="/services" className="link-wipe">Services</Link></li>
            <li><Link to="/about" className="link-wipe">About</Link></li>
            <li><Link to="/contact" className="link-wipe">Contact</Link></li>
          </ul>
        </div>
        <div className="bg-secondary p-8">
          <h3 className="label-tech">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />(555) 123-4567</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />hello@davidanservices.com</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span>123 Detail Drive, Suite 100<br />Los Angeles, CA 90001</span></li>
          </ul>
        </div>
        <div className="flex flex-col justify-between bg-secondary p-8">
          <h3 className="label-tech">Follow</h3>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="border border-border p-3 transition-colors hover:border-primary hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="border border-border p-3 transition-colors hover:border-primary hover:text-primary"><Facebook className="h-5 w-5" /></a>
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">© {currentYear} Davidan Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
