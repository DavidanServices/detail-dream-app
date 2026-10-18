import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, lead, align = "left", className = "" }: Props) {
  const center = align === "center";
  return (
    <div className={`reveal ${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
    </div>
  );
}
