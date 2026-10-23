// Editable page texts. Every text has a built-in default (so the site works with an empty database);
// /admin > Page texts lists these fields and stores only the ones that were changed.
export type TextField = {
  key: string;
  label: string;
  group: string;
  default: string;
  multiline?: boolean;
  hint?: string;
};

const interior = "Interior page";
const exterior = "Exterior page";
const ppf = "PPF page";
const company = "Company details (Privacy Policy and Terms)";
export const promoGroup = "Monthly offer (strip at the top of the site)";
const shared = "Shared (all detailing pages and the form)";

export const textFields: TextField[] = [
  // ---- Interior
  {
    key: "interior.seo.title",
    label: "Browser / Google title",
    group: interior,
    default: "Interior Car Detailing Packages | Davidan Services",
  },
  {
    key: "interior.seo.description",
    label: "Google description",
    group: interior,
    default: "",
    multiline: true,
    hint: "Leave empty to build it automatically from the current prices.",
  },
  {
    key: "interior.hero.eyebrow",
    label: "Small line above the headline",
    group: interior,
    default: "Davidan Services — Premium Interior Detailing",
  },
  {
    key: "interior.hero.title",
    label: "Headline (white part)",
    group: interior,
    default: "A Cleaner Interior.",
  },
  {
    key: "interior.hero.accent",
    label: "Headline (red part)",
    group: interior,
    default: "A Better Driving Experience.",
  },
  {
    key: "interior.hero.lead",
    label: "Intro text",
    group: interior,
    multiline: true,
    default:
      "Professional interior detailing for hatchbacks, saloons and SUVs. Every accessible surface is cleaned with care, so your cabin looks, feels and smells properly looked after.",
  },
  {
    key: "interior.packages.title",
    label: "Packages heading",
    group: interior,
    default: "Interior detailing, priced by vehicle size",
  },
  {
    key: "interior.packages.lead",
    label: "Packages intro",
    group: interior,
    default:
      "Every package includes the same seven services. Choose the one that matches your vehicle.",
  },
  {
    key: "interior.included.title",
    label: "What's included heading",
    group: interior,
    default: "Seven services in every interior detail",
    hint: "Update the number if you add or remove items.",
  },
  {
    key: "interior.included.lead",
    label: "What's included intro",
    group: interior,
    default: "The same thorough process, whichever package you choose.",
  },
  {
    key: "interior.included.note",
    label: "Note under the included items",
    group: interior,
    default: "Leather conditioning is available separately as an optional extra.",
  },
  {
    key: "interior.addon.hint",
    label: "Small line under the optional extra",
    group: interior,
    default: "Add it to any interior package.",
  },

  // ---- Exterior
  {
    key: "exterior.seo.title",
    label: "Browser / Google title",
    group: exterior,
    default: "Exterior Car Detailing Packages | Davidan Services",
  },
  {
    key: "exterior.seo.description",
    label: "Google description",
    group: exterior,
    default: "",
    multiline: true,
    hint: "Leave empty to build it automatically from the current prices.",
  },
  {
    key: "exterior.hero.eyebrow",
    label: "Small line above the headline",
    group: exterior,
    default: "Davidan Services — Exterior Detailing",
  },
  {
    key: "exterior.hero.title",
    label: "Headline (white part)",
    group: exterior,
    default: "Exterior",
  },
  {
    key: "exterior.hero.accent",
    label: "Headline (red part)",
    group: exterior,
    default: "Detailing",
  },
  {
    key: "exterior.hero.lead",
    label: "Intro text",
    group: exterior,
    multiline: true,
    default:
      "A clean, glossy and refreshed exterior with a premium finish. The same service is included for every vehicle size.",
  },
  {
    key: "exterior.packages.title",
    label: "Packages heading",
    group: exterior,
    default: "Exterior detailing, priced by vehicle size",
  },
  {
    key: "exterior.packages.lead",
    label: "Packages intro",
    group: exterior,
    default: "Same service included for all vehicle sizes.",
  },
  {
    key: "exterior.included.title",
    label: "What's included heading",
    group: exterior,
    default: "Five services in every exterior detail",
    hint: "Update the number if you add or remove items.",
  },
  {
    key: "exterior.included.lead",
    label: "What's included intro",
    group: exterior,
    default: "The same thorough process, whichever vehicle size you choose.",
  },
  {
    key: "exterior.included.note",
    label: "Note under the included items",
    group: exterior,
    default: "Polish is available separately as an add-on.",
  },
  {
    key: "exterior.addon.hint",
    label: "Small line under the optional extra",
    group: exterior,
    default: "Add it to any exterior package.",
  },
  {
    key: "exterior.result.text",
    label: "“The result” statement",
    group: exterior,
    multiline: true,
    default: "A clean, glossy and refreshed exterior with a premium finish.",
  },
  {
    key: "exterior.result.tagline",
    label: "“The result” tagline",
    group: exterior,
    default: "Quality in every detail",
  },
  {
    key: "exterior.protection.title",
    label: "Protection & bundles heading",
    group: exterior,
    default: "Protection & bundles",
  },
  {
    key: "exterior.protection.lead",
    label: "Protection & bundles intro",
    group: exterior,
    multiline: true,
    default:
      "Add long-lasting protection, or combine interior and exterior in one visit. Pick your vehicle type to see the price.",
  },

  // ---- PPF
  {
    key: "ppf.seo.title",
    label: "Browser / Google title",
    group: ppf,
    default: "Paint Protection Film (PPF) | Davidan Services",
  },
  {
    key: "ppf.seo.description",
    label: "Google description",
    group: ppf,
    default: "",
    multiline: true,
    hint: "Leave empty to use the built-in description.",
  },
  {
    key: "ppf.hero.eyebrow",
    label: "Small line above the headline",
    group: ppf,
    default: "Davidan Services — Paint Protection Film",
  },
  {
    key: "ppf.hero.title",
    label: "Headline (white part)",
    group: ppf,
    default: "Invisible protection",
  },
  {
    key: "ppf.hero.accent",
    label: "Headline (red part)",
    group: ppf,
    default: "for your paintwork.",
  },
  {
    key: "ppf.hero.lead",
    label: "Intro text",
    group: ppf,
    multiline: true,
    default:
      "Self-healing clear film that guards your paint against stone chips, scratches and road debris, while staying virtually invisible.",
  },
  {
    key: "ppf.about.title",
    label: "“What is PPF” heading",
    group: ppf,
    default: "What is paint protection film?",
  },
  {
    key: "ppf.about.lead",
    label: "“What is PPF” text",
    group: ppf,
    multiline: true,
    default:
      "A self-healing film applied to high-impact panels. Our clear PPF absorbs stone chips and light scratches while staying virtually invisible, helping your paintwork keep its finish. If you want a change of look, the same protection is also available in colour.",
  },
  {
    key: "ppf.sizes.title",
    label: "Packages heading",
    group: ppf,
    default: "Packages by vehicle size",
  },
  {
    key: "ppf.sizes.lead",
    label: "Packages intro",
    group: ppf,
    multiline: true,
    default:
      "Choose the size that matches your vehicle. Tell us the coverage you have in mind and we'll confirm the details.",
  },
  { key: "ppf.colors.title", label: "Colours heading", group: ppf, default: "Choose your finish" },
  {
    key: "ppf.colors.lead",
    label: "Colours intro",
    group: ppf,
    multiline: true,
    default:
      "The colours below are just a selection: we have a palette of 250 colours in gloss, satin and matte. Not sure which suits your car? Book a colour consultation and we'll go through the full palette with you.",
  },
  {
    key: "ppf.colors.note",
    label: "Colours note",
    group: ppf,
    multiline: true,
    default: "Colours on screen are a guide only; the real film can look different in person.",
  },

  // ---- Company details (legal pages)
  {
    key: "company.name",
    label: "Registered company name",
    group: company,
    default: "[Registered company name]",
    hint: "Shown on the Privacy Policy and Terms pages.",
  },
  {
    key: "company.number",
    label: "Company registration number",
    group: company,
    default: "[Company number]",
  },
  {
    key: "company.address",
    label: "Registered office address",
    group: company,
    default: "[Registered office address]",
  },
  {
    key: "company.vat",
    label: "VAT number",
    group: company,
    default: "[VAT number, if registered]",
  },
  {
    key: "company.ico",
    label: "ICO registration number",
    group: company,
    default: "[ICO registration number]",
  },
  {
    key: "company.email",
    label: "Contact email for privacy and legal matters",
    group: company,
    default: "contact@davidan.co.uk",
  },
  {
    key: "terms.paymentTerms",
    label: "Payment terms (Terms page)",
    group: company,
    multiline: true,
    default:
      "Payment is due when the work is completed, unless we have agreed something different with you in writing. We will tell you which payment methods we accept when we confirm your booking.",
  },
  {
    key: "terms.cancellationNotice",
    label: "Cancellation notice period (Terms page)",
    group: company,
    default: "24 hours",
    hint: "Used in the sentence “at least … notice”.",
  },

  // ---- Monthly offer
  {
    key: "promo.enabled",
    label: "Show the offer?",
    group: promoGroup,
    default: "no",
    hint: "Type yes to show the strip at the top of every page, no to hide it.",
  },
  {
    key: "promo.text",
    label: "Offer message",
    group: promoGroup,
    default: "Halloween offer: 15% off all packages",
    hint: "The text that scrolls across the strip.",
  },
  {
    key: "promo.percent",
    label: "Discount on all packages (%)",
    group: promoGroup,
    default: "15",
    hint: "Prices on the website show this discount with the old price crossed out. Use 0 for no price change.",
  },
  {
    key: "promo.ends",
    label: "Last day of the offer",
    group: promoGroup,
    default: "",
    hint: "Format YYYY-MM-DD, for example 2026-10-31. The offer switches itself off after this day. Leave empty for no end date.",
  },

  {
    key: "promo.theme",
    label: "Look of the strip",
    group: promoGroup,
    default: "brand",
  },

  // ---- Shared
  {
    key: "pricing.disclaimer",
    label: "Price disclaimer",
    group: shared,
    multiline: true,
    default:
      "Prices are starting rates for standard vehicles. Vehicle size, condition and individual requirements may affect the final quote.",
  },
  {
    key: "booking.title",
    label: "Booking section heading",
    group: shared,
    default: "Request a quote",
  },
  {
    key: "booking.lead",
    label: "Booking section intro",
    group: shared,
    multiline: true,
    default:
      "Tell us about your vehicle and we'll come back with availability and a clear price. No obligation.",
  },
];

export const defaultText: Record<string, string> = Object.fromEntries(
  textFields.map((f) => [f.key, f.default]),
);

/** The edited text if there is one, otherwise the built-in default. Empty edits fall back too. */
export const text = (content: Record<string, string>, key: string): string =>
  content[key]?.trim() || defaultText[key] || "";
