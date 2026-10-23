// Looks for the offer strip, chosen in /admin > Offer. Colours are plain CSS so they work in both
// the light and the dark theme of the site.
export type PromoThemeId =
  "brand" | "halloween" | "christmas" | "blackfriday" | "newyear" | "summer";

export type PromoTheme = {
  id: PromoThemeId;
  label: string;
  /** Strip background. */
  bg: string;
  /** Text colour. */
  fg: string;
  /** Colour of the separator and of the bottom line. */
  accent: string;
  /** Character between repeats of the message. */
  separator: string;
  /** Whether falling snowflakes are on by default for this look. */
  snow: boolean;
  /** Suggested message for a given discount. */
  message: (percent: number) => string;
};

const off = (percent: number) => (percent > 0 ? `${percent}% off all packages` : "special prices");

export const promoThemes: PromoTheme[] = [
  {
    id: "brand",
    label: "Davidan red",
    bg: "var(--primary)",
    fg: "var(--primary-foreground)",
    accent: "rgba(255,255,255,0.6)",
    separator: "◆",
    snow: false,
    message: (p) => `Special offer: ${off(p)}`,
  },
  {
    id: "halloween",
    label: "Halloween",
    bg: "linear-gradient(90deg,#1b1024,#2d1240 50%,#1b1024)",
    fg: "#ffb347",
    accent: "#ff7a00",
    separator: "🎃",
    snow: false,
    message: (p) => `Halloween offer: ${off(p)}`,
  },
  {
    id: "christmas",
    label: "Christmas",
    bg: "linear-gradient(90deg,#8a0f16,#b3121b 50%,#8a0f16)",
    fg: "#ffffff",
    accent: "#ffd166",
    separator: "❄",
    snow: true,
    message: (p) => `Christmas special: ${off(p)}`,
  },
  {
    id: "blackfriday",
    label: "Black Friday",
    bg: "#0b0b0b",
    fg: "#ffd60a",
    accent: "#ffd60a",
    separator: "★",
    snow: false,
    message: (p) => `Black Friday: ${off(p)}`,
  },
  {
    id: "newyear",
    label: "New Year",
    bg: "linear-gradient(90deg,#0a1633,#14285c 50%,#0a1633)",
    fg: "#f5d77a",
    accent: "#f5d77a",
    separator: "✦",
    snow: false,
    message: (p) => `New Year offer: ${off(p)}`,
  },
  {
    id: "summer",
    label: "Summer",
    bg: "linear-gradient(90deg,#ffb703,#ffd23f 50%,#ffb703)",
    fg: "#231a00",
    accent: "#231a00",
    separator: "☀",
    snow: false,
    message: (p) => `Summer offer: ${off(p)}`,
  },
];

export const themeById = (id: string | undefined): PromoTheme =>
  promoThemes.find((t) => t.id === id) ?? promoThemes[0]!;
