import { site } from "@/data/site";

export type LegalSection = { heading: string; body: string[] };

export const legalUpdated = "October 2026";

export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${site.name} ("we", "us") provides premium car detailing services. This policy explains how we handle personal information collected through ${site.url.replace("https://", "")}. You can contact us at ${site.email}.`,
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "When you use our contact or booking form we collect your name, email address, phone number (optional), the service you are interested in and any message or vehicle details you choose to send.",
      "We do not run advertising or analytics trackers on this website. Your light or dark theme choice is saved in your browser's local storage so the site remembers it; it never leaves your device.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use your details only to reply to your enquiry, provide a quote, arrange and carry out your booking, and keep reasonable records of the work we do. We do not sell your information or use it for unrelated marketing.",
      "Our legal basis is taking steps at your request before entering into a contract, and our legitimate interest in running and administering the business.",
    ],
  },
  {
    heading: "Third parties",
    body: [
      "The site loads typefaces from Google Fonts and shows an embedded Google Map on the contact page, which means your browser makes requests to Google when those load. We may use email and hosting providers to receive enquiries and serve the website; they process data only on our instructions.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiries are kept for as long as needed to respond and, for completed bookings, for the period required for accounting and warranty purposes. We then delete or anonymise them.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under UK data protection law you can ask us for a copy of your data, to correct it, to delete it, or to restrict or object to how we use it. Email us at the address above and we will respond within one month.",
      "If you are unhappy with how we handle your data, you can complain to the Information Commissioner's Office (ico.org.uk).",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update this policy from time to time. The date at the top shows when it was last changed.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Bookings and quotes",
    body: [
      "Prices shown on the website are starting prices and depend on vehicle size and condition. We confirm a final price before work begins. A booking is confirmed once we have agreed a date and price with you.",
    ],
  },
  {
    heading: "Cancellations and changes",
    body: [
      "Please give us at least 24 hours' notice if you need to cancel or reschedule so we can offer the slot to someone else. Repeated late cancellations may affect future bookings.",
    ],
  },
  {
    heading: "Your vehicle",
    body: [
      "We inspect your vehicle before starting and note any existing damage or areas that need attention. Please remove valuables and personal belongings. We are not responsible for items left in the vehicle.",
      "Results depend on the existing condition of the paint and interior. Some defects, stains or wear cannot be fully corrected, and we will tell you when we see this.",
    ],
  },
  {
    heading: "Care and liability",
    body: [
      "We work with reasonable skill and care and are fully insured for the work we carry out. We are not liable for damage that results from pre-existing faults or from instructions you give that we advise against. Nothing in these terms limits your statutory rights.",
    ],
  },
  {
    heading: "Satisfaction promise",
    body: [
      "If you are not happy with the result, tell us at handover or within a few days and we will inspect it and put right anything that falls short of our standard.",
    ],
  },
  {
    heading: "Protective coatings and film",
    body: [
      "Ceramic coatings and paint protection film perform best with correct aftercare. We will give you written aftercare guidance; protection may be affected if it is not followed.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction over any dispute.",
    ],
  },
];
