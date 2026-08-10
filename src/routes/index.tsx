import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Sparkles, Droplets, CheckCircle } from "lucide-react";
import heroImage from "../assets/hero-detailing.jpg";
import exteriorImage from "../assets/service-exterior.jpg";
import interiorImage from "../assets/service-interior.jpg";
import ceramicImage from "../assets/service-ceramic.jpg";
import ppfImage from "../assets/service-ppf.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxe Auto Detail | Premium Car Detailing in Los Angeles" },
      { name: "description", content: "Expert exterior and interior detailing, ceramic coating, and paint protection film. Restore and protect your vehicle with Luxe Auto Detail." },
      { property: "og:title", content: "Luxe Auto Detail | Premium Car Detailing in Los Angeles" },
      { property: "og:description", content: "Expert exterior and interior detailing, ceramic coating, and paint protection film." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const services = [
  {
    title: "Exterior Detailing",
    description: "Hand wash, clay bar, paint decontamination, and gloss-enhancing sealant for a mirror finish.",
    image: exteriorImage,
    icon: Droplets,
  },
  {
    title: "Interior Detailing",
    description: "Deep cleaning, leather conditioning, steam treatment, and odor elimination for a cabin that feels new.",
    image: interiorImage,
    icon: Sparkles,
  },
  {
    title: "Ceramic Coating",
    description: "Long-lasting hydrophobic protection that adds depth, gloss, and makes maintenance effortless.",
    image: ceramicImage,
    icon: Shield,
  },
  {
    title: "Paint Protection Film",
    description: "Self-healing clear film applied to high-impact areas to guard against chips, scratches, and road debris.",
    image: ppfImage,
    icon: CheckCircle,
  },
];

const highlights = [
  "Premium products & professional-grade tools",
  "Trained, insured detailing technicians",
  "Paint-safe techniques on every vehicle",
  "Satisfaction guaranteed",
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury car in premium detailing studio"
            className="h-full w-full object-cover opacity-40"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark/90 via-charcoal-dark/70 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
              Premium Auto Detailing
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Drive a car that looks brand new.
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              Expert detailing, ceramic coating, and paint protection film — precision care for the vehicle you love.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-electric"
              >
                Book an Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything your vehicle needs to look its best and stay protected.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width={1024}
                    height={768}
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-primary p-2 text-primary-foreground">
                    <service.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-lg font-semibold text-card-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-snow py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why drivers trust Luxe Auto
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We treat every vehicle like it's our own. From daily drivers to exotic collectibles, our process is meticulous, paint-safe, and built around lasting results.
              </p>
              <ul className="mt-8 space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Meet the team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={exteriorImage}
                alt="Professional exterior detailing"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1024}
                height={768}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-charcoal-dark py-20 lg:py-28">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your ride?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Book your appointment today and experience the difference a professional detail can make.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-electric"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
