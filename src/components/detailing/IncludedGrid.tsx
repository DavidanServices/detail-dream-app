import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { stagger } from "@/lib/motion";

type Item = { icon: LucideIcon; title: string; text: string };

// Icon grid of the services included in every package, with an optional closing note cell.
export function IncludedGrid({ items, note }: { items: readonly Item[]; note?: ReactNode }) {
  return (
    <ul className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li
          key={item.title}
          style={stagger(i % 3)}
          className="reveal group flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-muted"
        >
          <span className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <item.icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-heading text-2xl text-card-foreground">{item.title}</h3>
            {item.text !== item.title && (
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.text}</p>
            )}
          </div>
        </li>
      ))}
      {note && (
        <li className="reveal flex flex-col justify-center gap-2 bg-background p-7 text-muted-foreground">
          {note}
        </li>
      )}
    </ul>
  );
}
