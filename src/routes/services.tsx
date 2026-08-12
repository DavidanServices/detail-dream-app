import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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

const vehicleTypes = [
  { id: "hatchback", label: "Hatchback", hint: "Small & compact cars" },
  { id: "saloon", label: "Saloon / Coupe", hint: "Sedans & coupes" },
  { id: "suv", label: "SUV", hint: "4x4s, MPVs & large vehicles" },
] as const;

type VehicleType = (typeof vehicleTypes)[number]["id"];

const packages: {
  id: string;
  name: string;
  prices: Record<VehicleType, number>;
  description: string;
  features: string[];
  popular: boolean;
}[] = [
  {
    id: "interior",
    name: "Interior Detail",
    prices: { hatchback: 105, saloon: 120, suv: 140 },
    description: "Deep clean and restore your cabin from top to bottom.",
    features: ["Vacuuming & shampoo", "Leather conditioning", "Steam sanitization", "Odor elimination"],
    popular: false,
  },
  {
    id: "exterior",
    name: "Exterior Detail",
    prices: { hatchback: 110, saloon: 130, suv: 150 },
    description: "Hand wash, clay bar, and protect your paintwork.",
    features: ["Hand wash & dry", "Clay bar treatment", "Paint decontamination", "Sealant or wax protection"],
    popular: false,
  },
  {
    id: "exterior-interior",
    name: "Exterior + Interior",
    prices: { hatchback: 185, saloon: 210, suv: 250 },
    description: "Our most popular combo — a complete inside-and-out refresh.",
    features: ["Full exterior detail", "Full interior detail", "Paint-safe techniques", "Cabin deep clean"],
    popular: true,
  },
  {
    id: "ceramic",
    name: "Ceramic Coating",
    prices: { hatchback: 175, saloon: 200, suv: 220 },
    description: "Long-lasting hydrophobic protection with a deep gloss finish.",
    features: ["Multi-year protection", "Hydrophobic finish", "UV resistance", "Enhanced depth & gloss"],
    popular: false,
  },
  {
    id: "complete",
    name: "The Complete Bundle",
    prices: { hatchback: 310, saloon: 360, suv: 420 },
    description: "Everything in one package: exterior, interior, and ceramic coating.",
    features: ["Exterior + Interior detail", "Ceramic coating application", "Full protection & gloss", "Best value"],
    popular: false,
  },
];

const ppfPackage = {
  id: "ppf",
  name: "Paint Protection Film",
  startingFrom: 350,
  description: "Invisible, self-healing armor for high-impact areas.",
  features: ["Self-healing technology", "UV stable", "Prevents rock chips", "Custom coverage options"],
};

function ServicesPage() {
  const [vehicle, setVehicle] = useState<VehicleType>("hatchback");
  const vehicleLabel = vehicleTypes.find((v) => v.id === vehicle)!.label;

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
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Packages & Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Transparent pricing for every level of care. All packages are tailored to your vehicle's size and condition.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg ${pkg.popular ? "border-primary/50 ring-1 ring-primary/20" : "border-border"}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold text-card-foreground">{pkg.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-foreground">£{pkg.price}</span>
                  <span className="text-muted-foreground">starting</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  search={{ service: pkg.name }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Book Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}

            <div className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <h3 className="font-heading text-xl font-semibold text-card-foreground">{ppfPackage.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ppfPackage.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">£{ppfPackage.startingFrom}</span>
                <span className="text-muted-foreground">starting from</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {ppfPackage.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/ppf"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
              >
                Configure Coverage <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-snow py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Service Details
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A closer look at what's included in every treatment we offer.
            </p>
          </div>
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
                  {service.id === "ppf" && (
                    <Link
                      to="/ppf"
                      className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Open the PPF configurator <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal-dark py-16">
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
