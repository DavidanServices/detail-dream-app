import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Droplets, Sparkles, Shield, CheckCircle } from "lucide-react";
import exteriorImage from "../assets/service-exterior.jpg";
import interiorImage from "../assets/service-interior.jpg";
import ceramicImage from "../assets/service-ceramic.jpg";
import ppfImage from "../assets/service-ppf.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Luxe Auto Detail" },
      { name: "description", content: "Explore our premium auto detailing services: exterior detailing, interior detailing, ceramic coating, and paint protection film." },
      { property: "og:title", content: "Our Services — Luxe Auto Detail" },
      { property: "og:description", content: "Explore our premium auto detailing services." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    id: "exterior",
    title: "Exterior Detailing",
    short: "Wash, decontaminate, and protect your paint.",
    description:
      "Our exterior detail begins with a thorough hand wash and dry, followed by clay bar decontamination to remove embedded contaminants. We finish with a high-quality sealant or wax to enhance gloss and provide protection against the elements.",
    features: ["Hand wash & dry", "Clay bar treatment", "Paint decontamination", "Sealant or wax protection", "Wheel & tire deep clean"],
    image: exteriorImage,
    icon: Droplets,
  },
  {
    id: "interior",
    title: "Interior Detailing",
    short: "Deep clean and restore your cabin.",
    description:
      "We clean every surface of your interior — vacuuming, steam cleaning, leather conditioning, plastic restoration, and odor elimination. The result is a cabin that looks, feels, and smells like new.",
    features: ["Vacuuming & shampoo", "Leather cleaning & conditioning", "Steam sanitization", "Dashboard & trim care", "Odor elimination"],
    image: interiorImage,
    icon: Sparkles,
  },
  {
    id: "ceramic",
    title: "Ceramic Coating",
    short: "Long-lasting gloss and hydrophobic protection.",
    description:
      "Ceramic coating forms a durable, hydrophobic layer over your paint. It locks in gloss, repels water and dirt, and makes routine washing easier while protecting against UV rays and minor contaminants.",
    features: ["Multi-year protection", "Hydrophobic finish", "UV resistance", "Enhanced depth & gloss", "Easier maintenance"],
    image: ceramicImage,
    icon: Shield,
  },
  {
    id: "ppf",
    title: "Paint Protection Film",
    short: "Invisible armor against chips and scratches.",
    description:
      "Our self-healing paint protection film is applied to high-impact areas like the hood, bumper, fenders, and mirrors. It absorbs rock chips, scratches, and road debris while remaining virtually invisible.",
    features: ["Self-healing technology", "UV stable", "Prevents rock chips", "Preserves resale value", "Custom coverage options"],
    image: ppfImage,
    icon: CheckCircle,
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">What We Do</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Premium detailing services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Protect, restore, and elevate your vehicle with our specialized detailing packages.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={1024}
                      height={768}
                    />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <service.icon className="h-4 w-4" />
                    {service.title}
                  </div>
                  <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground">
                    {service.short}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-snow py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">Not sure which service is right?</h2>
          <p className="mt-2 text-muted-foreground">We'll recommend the best package based on your vehicle and goals.</p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-electric"
          >
            Get a recommendation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
