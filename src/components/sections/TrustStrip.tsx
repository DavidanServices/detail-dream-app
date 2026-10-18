import { trustItems } from "@/data/content";

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="reveal mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {trustItems.map((item) => (
          <div key={item.title} className="group flex items-start gap-4">
            <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            <div>
              <p className="font-heading text-lg uppercase tracking-wide text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
