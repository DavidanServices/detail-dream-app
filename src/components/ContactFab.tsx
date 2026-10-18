import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileText, MessageCircle, Phone, X } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { site, telHref, whatsappUrl } from "@/data/site";

// Floating contact bubble: expands into WhatsApp, phone and request-a-quote.
export function ContactFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const bubble =
    "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-95";
  const label =
    "rounded-sm border border-border bg-background/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground shadow-lg backdrop-blur";
  const row = "group flex items-center gap-3 [animation:pop_.35s_cubic-bezier(.2,.7,.2,1)_both]";

  return (
    <div
      ref={ref}
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      {open && (
        <ul className="flex flex-col items-end gap-3" aria-label="Contact options">
          <li>
            <Link
              to="/contact"
              search={{ service: "Not sure" }}
              onClick={() => setOpen(false)}
              className={row}
              style={{ animationDelay: "0ms" }}
            >
              <span className={label}>Request quote</span>
              <span className={`${bubble} bg-foreground text-background`}>
                <FileText className="h-5 w-5" />
              </span>
            </Link>
          </li>
          <li>
            <a
              href={telHref}
              onClick={() => setOpen(false)}
              className={row}
              style={{ animationDelay: "60ms" }}
            >
              <span className={label}>Call us</span>
              <span className={`${bubble} bg-primary text-primary-foreground`}>
                <Phone className="h-5 w-5" />
              </span>
            </a>
          </li>
          <li>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className={row}
              style={{ animationDelay: "120ms" }}
            >
              <span className={label}>WhatsApp</span>
              <span className={`${bubble} bg-[#25D366] text-white`}>
                <WhatsappIcon className="h-6 w-6" />
              </span>
            </a>
          </li>
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close contact options" : `Contact ${site.name}`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {!open && (
          <span
            className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:2.6s]"
            aria-hidden
          />
        )}
        <MessageCircle
          className={`absolute h-6 w-6 transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        />
        <X
          className={`absolute h-6 w-6 transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
        />
      </button>
    </div>
  );
}
