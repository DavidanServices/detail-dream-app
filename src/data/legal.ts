import { site } from "@/data/site";

export type LegalSection = { heading: string; body: string[] };

export const legalUpdated = "22 October 2026";

type T = (key: string) => string;

// Both documents read the company details through `t`, so they come from /admin > Page texts
// ("Company details") and the placeholders in square brackets disappear once they are filled in.
export const privacySections = (t: T): LegalSection[] => [
  {
    heading: "Who we are",
    body: [
      `${site.name} is a car detailing business based at ${site.address.lines.join(", ")}. The company responsible for your personal information (the "controller") is ${t("company.name")}, company number ${t("company.number")}, registered office ${t("company.address")}. In this policy "we" and "us" mean that company.`,
      `Data protection registration (ICO): ${t("company.ico")}. For anything about your personal information, contact us at ${t("company.email")} or on ${site.phone}.`,
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "When you send an enquiry or booking request through the website we collect your name, email address, phone number (optional), the service you are interested in, your vehicle category, a preferred date (optional), any optional extras you pick and any message you write.",
      "If you contact us by phone, WhatsApp or email we also keep the messages you send us and our replies, so we can quote and carry out the work.",
      "When you use the website, our hosting provider processes technical information such as your IP address, browser type, device and the pages you request. This is needed to deliver the site and keep it secure.",
      "We do not collect payment card details on this website.",
    ],
  },
  {
    heading: "How and why we use it",
    body: [
      "To reply to your enquiry, prepare a quote, agree a date and carry out the work. Our lawful basis is taking steps at your request before entering into a contract, and performing that contract.",
      "To run and protect the business: keeping records of enquiries and jobs, preventing spam and misuse of the website, and keeping the site secure. Our lawful basis is our legitimate interest in running a safe and well-organised business.",
      "To meet legal duties such as tax and accounting rules. Our lawful basis is legal obligation.",
      "We do not sell your information, and we do not send marketing emails or messages unless you have asked for them.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We use a small number of trusted service providers (processors) who handle data only on our instructions:",
      "Supabase, which stores enquiries and the prices and texts shown on this website. Cloudflare, which hosts and delivers the website and protects it from abuse. Resend, which delivers the email that notifies us of a new enquiry.",
      "The site also loads typefaces from Google Fonts, and the contact page can show a Google Map, but only after you choose to load it. When those load, your browser connects to Google and Google receives technical information such as your IP address.",
      "We may also share information where the law requires it, for example with HMRC or the police.",
    ],
  },
  {
    heading: "Transfers outside the UK",
    body: [
      "Some of these providers are based in, or process data in, countries outside the UK. Where that happens we rely on safeguards approved under UK data protection law, such as the UK International Data Transfer Agreement or the UK Addendum to the EU standard contractual clauses, or an adequacy arrangement.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiries that do not become a booking are kept for as long as we need to follow them up, and are then deleted or anonymised.",
      "Records of work carried out and invoices are kept for six years, to meet tax and accounting requirements.",
    ],
  },
  {
    heading: "Cookies and similar technologies",
    body: [
      "We do not use advertising or analytics cookies. If you choose the light or dark theme, your choice is saved in your browser's local storage so the site remembers it. This stays on your device and is not sent to us.",
      "The Google Map on the contact page is not loaded until you click to show it. Once it loads, Google may set its own cookies, which are covered by Google's privacy policy. Staff who sign in to manage the website use a sign-in session; visitors never do.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under UK data protection law you have the right to ask for a copy of your personal information, to have it corrected or deleted, to restrict or object to how we use it, and to receive it in a portable format. Where we rely on your consent you can withdraw it at any time.",
      `To use any of these rights contact us at ${t("company.email")}. We will reply within one month.`,
      "If you are unhappy with how we handle your information you can complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113.",
    ],
  },
  {
    heading: "Security",
    body: [
      "The website is served over HTTPS. Access to enquiries is limited to authorised staff who sign in, and the database enforces who can read or change each type of record. No system is perfectly secure, but we take reasonable steps to protect your information.",
    ],
  },
  {
    heading: "Children",
    body: [
      "This website is not aimed at children and we do not knowingly collect their personal information.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The date at the top shows when it was last changed.",
    ],
  },
];

export const termsSections = (t: T): LegalSection[] => [
  {
    heading: "About these terms",
    body: [
      `These terms apply to all services supplied by ${site.name}, the trading name of ${t("company.name")}, company number ${t("company.number")}, registered office ${t("company.address")}. VAT number: ${t("company.vat")}.`,
      `You can contact us at ${t("company.email")}, on ${site.phone}, or at ${site.address.lines.join(", ")}. By booking with us you agree to these terms. Nothing in them affects your legal rights as a consumer.`,
    ],
  },
  {
    heading: "Our services",
    body: [
      "We provide exterior and interior vehicle detailing, ceramic coating, paint protection film and related services, as described on this website. The descriptions and photographs on the site are a guide to the standard of work and the finish you can expect.",
    ],
  },
  {
    heading: "Quotes and prices",
    body: [
      "Prices shown on the website are starting rates for standard vehicles. Vehicle size, condition and your individual requirements may change the price, so we confirm a final price with you before any work begins. The price in your confirmed quote is the price you pay for that work.",
      "Optional extras, such as leather conditioning or polish, are priced separately and only added if you ask for them.",
    ],
  },
  {
    heading: "Booking and confirmation",
    body: [
      "An enquiry sent through the website, by phone or by message is a request for a quote, not a booking. A booking is made once we have agreed the date, the services and the price with you and confirmed this in writing, for example by email or message.",
    ],
  },
  {
    heading: "Payment",
    body: [t("terms.paymentTerms")],
  },
  {
    heading: "Cancelling or rescheduling",
    body: [
      `Please give us at least ${t("terms.cancellationNotice")} notice if you need to cancel or move your booking, so we can offer the slot to someone else. Repeated late cancellations may affect future bookings.`,
      "If you booked online or by phone you also have a legal right to cancel within 14 days of the booking being made. If you ask us to start the work during that period and then cancel, you must pay for the work already done up to that point.",
    ],
  },
  {
    heading: "Your vehicle",
    body: [
      "Please give us accurate information about the vehicle and its condition when you ask for a quote. We inspect your vehicle before starting and note any existing damage or areas that need attention. Please remove valuables and personal belongings, because we cannot be responsible for items left in the vehicle.",
      "We may decline or stop work if the vehicle is unsafe to work on, is in a condition that makes the agreed service unsuitable, or if work cannot be carried out safely. We will explain why and refund any payment for work not done.",
    ],
  },
  {
    heading: "Results and limitations",
    body: [
      "Results depend on the existing condition of the paint, glass, trim and interior. Some defects, stains and wear cannot be fully corrected, and we will tell you when we see this. Detailing does not repair structural or mechanical faults.",
    ],
  },
  {
    heading: "Ceramic coatings and paint protection film",
    body: [
      "Protective coatings and film perform best with correct aftercare. We will give you written aftercare guidance when we hand the vehicle back. Protection can be affected if the guidance is not followed, or by damage after the work, such as impacts, harsh chemicals or accidents.",
      "Any warranty or guarantee that applies to a coating or film is the one we state in writing when you book.",
    ],
  },
  {
    heading: "Our responsibility",
    body: [
      "We carry out our services with reasonable skill and care, and we are insured for the work we do. If we cause damage to your vehicle through our negligence, we will put it right or compensate you for the reasonable cost of repair.",
      "We are not liable for damage or faults that were already present, for items left in the vehicle, or for loss that was not a foreseeable result of our failure. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else the law does not allow us to limit.",
    ],
  },
  {
    heading: "If something is not right",
    body: [
      "If you are not happy with the work, tell us at handover or as soon as you notice, so we can inspect the vehicle and put right anything that falls short of the standard we promised. If we cannot resolve it together, you keep your rights under the Consumer Rights Act 2015.",
    ],
  },
  {
    heading: "Using this website",
    body: [
      "The content of this website, including text, logos and photographs, belongs to us or is used with permission. Please do not copy it without asking. We try to keep the website accurate and available, but we cannot promise it will always be free of errors or interruptions.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The terms in force on the day you make your booking are the ones that apply to it.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction over any dispute. If you live in Scotland or Northern Ireland you may also bring a claim in the courts of the part of the UK where you live.",
    ],
  },
];
