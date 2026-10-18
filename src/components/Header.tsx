import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/data/site";

const navLinks = [
  { to: "/", label: "Home", n: "01" },
  { to: "/services", label: "Services", n: "02" },
  { to: "/about", label: "About", n: "03" },
  { to: "/contact", label: "Contact", n: "04" },
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
          mobileOpen ? "bg-charcoal-dark" : "bg-background/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-stretch justify-between px-4 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center pr-4 md:border-r md:border-border md:pr-6">
            <img src="/logo.png" alt={`${site.name} logo`} className="h-12 w-auto shrink-0 transition-transform duration-300 hover:scale-105 sm:h-14" width={512} height={200} />
          </Link>

          <nav className="hidden flex-1 items-stretch md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative flex items-center gap-1.5 border-r border-border px-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:text-foreground lg:gap-2 lg:px-6 lg:text-sm lg:tracking-[0.14em] ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="font-mono text-[10px] text-primary">{link.n}</span>
                  {link.label}
                  <span className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-primary transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center border-l border-border px-2 md:flex">
            <ThemeToggle />
          </div>

          <Link
            to="/contact"
            className="group hidden shrink-0 items-center gap-2 bg-primary px-4 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-electric-glow lg:gap-3 lg:px-8 lg:text-sm lg:tracking-[0.14em] md:flex"
          >
            Book Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center p-2 text-foreground transition-transform active:scale-90"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
          </div>
        </div>
        <div aria-hidden className="scroll-progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-primary" />
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
                  className="flex items-baseline gap-4 border-b border-border py-6 font-heading text-5xl font-extrabold uppercase [animation:link-in_.45s_cubic-bezier(.2,.7,.2,1)_both]"
                  style={{ animationDelay: `${120 + i * 60}ms` }}
                >
                  <span className="font-mono text-xs text-muted-foreground">{link.n}</span>
                  <span className={pathname === link.to ? "text-primary" : "text-foreground"}>{link.label}</span>
                </Link>
              ))}
            </nav>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between bg-primary px-6 py-6 text-lg font-bold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Book Now <ArrowUpRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
