import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/data/site";

const navLinks = [
  { to: "/exterior-detailing", label: "Exterior" },
  { to: "/interior-detailing", label: "Interior" },
  { to: "/ppf", label: "PPF" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`enter-down sticky top-0 z-50 w-full border-b border-border transition-colors duration-300 ${
          mobileOpen ? "bg-charcoal-dark" : "bg-background/85 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/logo.png"
              alt={`${site.name} logo`}
              className="h-12 w-auto transition-transform duration-300 hover:scale-105"
              width={512}
              height={200}
            />
          </Link>

          <nav className="hidden items-center gap-5 md:flex lg:gap-9">
            {navLinks.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors hover:text-foreground ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/contact"
              className="btn-primary group hidden items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground md:inline-flex"
            >
              Book now
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 text-foreground transition-transform active:scale-90 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
        <div
          aria-hidden
          className="scroll-progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-primary"
        />
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-charcoal-dark/70 [animation:fade-in_.3s_ease-out]"
          />
          <div className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-border bg-charcoal-dark [animation:menu-slide-in_.42s_cubic-bezier(.2,.7,.2,1)] sm:max-w-[420px]">
            <nav className="flex flex-1 flex-col justify-end px-6 pb-10 pt-24">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 border-b border-border py-5 font-heading text-4xl font-bold uppercase [animation:link-in_.45s_cubic-bezier(.2,.7,.2,1)_both]"
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                >
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <span className={pathname === link.to ? "text-primary" : "text-foreground"}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between bg-primary px-6 py-6 text-base font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Book now <ArrowUpRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
