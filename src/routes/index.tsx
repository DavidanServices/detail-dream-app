import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Sparkles, Droplets, CheckCircle, Star } from "lucide-react";
import heroImage from "../assets/hero-detailing.jpg";
import exteriorImage from "../assets/service-exterior.jpg";
import interiorImage from "../assets/service-interior.jpg";
import ceramicImage from "../assets/service-ceramic.jpg";
import ppfImage from "../assets/service-ppf.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Davidan Services | Premium Car Detailing in Los Angeles" },
      { name: "description", content: "Expert exterior and interior detailing, ceramic coating, and paint protection film. Restore and protect your vehicle with Davidan Services." },
      { property: "og:title", content: "Davidan Services | Premium Car Detailing in Los Angeles" },
      { property: "og:description", content: "Expert exterior and interior detailing, ceramic coating, and paint protection film." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const packages = [
  { name: "Interior Detail", price: "£105" },
  { name: "Exterior Detail", price: "£110" },
  { name: "Exterior + Interior", price: "£185", popular: true },
  { name: "Ceramic Coating", price: "£175" },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1440px] lg:grid-cols-12">
          <div className="relative z-10 flex flex-col justify-between px-4 py-14 sm:px-8 lg:col-span-6 lg:py-20">
            <p className="label-tech">Premium Auto Detailing — Est. Davidan</p>
            <div>
              <h1 className="font-heading text-[4.5rem] leading-[0.85] text-foreground sm:text-[7rem] xl:text-[9rem]">
                Drive a car that looks <span className="text-primary">brand new.</span>
              </h1>
              <p className="mt-8 max-w-md border-l-2 border-primary pl-5 text-lg text-muted-foreground">
                Expert detailing, ceramic coating, and paint protection film — precision care for the vehicle you love.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="group glow-electric inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-electric-glow">
                Book an Appointment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="inline-flex items-center border border-border px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-foreground">
                View Services
              </Link>
            </div>
          </div>
          <div className="relative min-h-[50vh] lg:col-span-6">
            <img src={heroImage} alt="Luxury car in premium detailing studio" className="clip-corner absolute inset-0 h-full w-full object-cover" width={1920} height={1080} fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent lg:bg-gradient-to-r" />
            <div className="absolute bottom-6 right-6 hidden border border-border bg-background/80 p-4 backdrop-blur sm:block">
              <p className="label-tech">Packages from</p>
              <p className="font-heading text-5xl font-black text-foreground">£105</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services index */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="reveal mb-12 flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
            <h2 className="font-heading text-6xl font-black text-foreground sm:text-8xl">Our Services</h2>
            <p className="max-w-sm text-lg text-muted-foreground">Everything your vehicle needs to look its best and stay protected.</p>
          </div>
          <div className="divide-y divide-border border-b border-border">
            {services.map((service, i) => (
              <Link key={service.title} to="/services" className="reveal group grid items-center gap-6 py-6 md:grid-cols-12">
                <span className="font-mono text-sm text-primary md:col-span-1">0{i + 1}</span>
                <h3 className="font-heading text-4xl font-extrabold text-foreground transition-transform duration-300 group-hover:translate-x-3 sm:text-5xl md:col-span-5">{service.title}</h3>
                <p className="text-muted-foreground md:col-span-3">{service.description}</p>
                <div className="relative h-32 overflow-hidden md:col-span-3">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0" loading="lazy" width={1024} height={768} />
                  <span className="absolute bottom-0 right-0 flex items-center gap-1 bg-primary px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground">
                    <service.icon className="h-3.5 w-3.5" /> Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Packages & Pricing */}
      <section className="hairline-grid border-y border-border bg-snow py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="reveal mb-12 max-w-3xl">
            <p className="label-tech">Price list</p>
            <h2 className="mt-4 font-heading text-6xl font-black text-foreground sm:text-8xl">Packages & Pricing</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Clear, upfront pricing for every level of care. Prices vary by vehicle type — hatchback, saloon/coupe or SUV.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`reveal group relative flex flex-col p-8 transition-colors ${pkg.popular ? "bg-primary text-primary-foreground" : "bg-background hover:bg-card"}`}>
                {pkg.popular && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em]">
                    <Star className="h-3 w-3" /> Most Popular
                  </span>
                )}
                <h3 className="font-heading text-2xl font-bold">{pkg.name}</h3>
                <p className={`mt-12 text-xs uppercase tracking-[0.2em] ${pkg.popular ? "" : "text-muted-foreground"}`}>starting from</p>
                <p className="font-heading text-7xl font-black">{pkg.price}</p>
                <Link to="/contact" search={{ service: pkg.name }} className={`mt-8 inline-flex items-center justify-between border-t pt-4 text-sm font-bold uppercase tracking-[0.1em] ${pkg.popular ? "border-primary-foreground/40" : "border-border group-hover:text-primary"}`}>
                  Book Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-px grid gap-px bg-border sm:grid-cols-2">
            {[
              { t: "The Complete Bundle", d: "Exterior + Interior + Ceramic Coating", p: "from £310", s: "The Complete Bundle", c: "Book bundle" },
              { t: "Paint Protection Film", d: "Custom coverage for high-impact areas", p: "from £350", s: "Paint Protection Film", c: "Request quote" },
            ].map((x) => (
              <div key={x.t} className="reveal flex flex-col justify-between gap-4 bg-card p-8 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-heading text-3xl font-bold text-card-foreground">{x.t}</h3>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-heading text-4xl font-black text-foreground">{x.p}</p>
                  <Link to="/contact" search={{ service: x.s }} className="link-wipe mt-1 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[0.1em] text-primary">
                    {x.c} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-8 lg:grid-cols-12">
          <div className="reveal relative aspect-[4/5] overflow-hidden lg:col-span-5">
            <img src={exteriorImage} alt="Professional exterior detailing" className="clip-corner h-full w-full object-cover" loading="lazy" width={1024} height={768} />
          </div>
          <div className="reveal flex flex-col justify-center lg:col-span-7">
            <h2 className="font-heading text-5xl font-black text-foreground sm:text-7xl">Why drivers trust Davidan Services</h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              We treat every vehicle like it's our own. From daily drivers to exotic collectibles, our process is meticulous, paint-safe, and built around lasting results.
            </p>
            <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2">
              {highlights.map((item, i) => (
                <li key={item} className="flex items-start gap-4 bg-background p-5">
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:text-primary">
                Meet the team <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="glow-electric inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
