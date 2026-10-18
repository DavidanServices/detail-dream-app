// Single source of truth for business details. The contact details below are placeholders
// until the real ones are provided.
export const site = {
  name: "Davidan Services",
  url: "https://davidan.co.uk",
  locale: "en_GB",
  phone: "(555) 123-4567",
  email: "hello@davidanservices.com",
  address: {
    lines: ["123 Detail Drive, Suite 100", "Los Angeles, CA 90001"],
  },
  hours: ["Mon–Fri: 8am – 6pm", "Saturday: 9am – 4pm"],
  ogImage: "/og-image.jpg",
} as const;

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;
