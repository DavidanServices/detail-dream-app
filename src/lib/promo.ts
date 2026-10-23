import { createContext, useContext } from "react";
import { text } from "@/data/page-text";
import { themeById, type PromoThemeId } from "@/data/promo-themes";
import { supabase } from "@/lib/supabase";

// The monthly offer is managed in /admin > Offer. It is stored in site_content like every other
// text, so it needs no extra table.
export type Promo = {
  text: string;
  percent: number;
  /** Last day of the offer, YYYY-MM-DD, or "" for no end date. */
  endsOn: string;
  theme: PromoThemeId;
  /** Falling snowflakes over the strip. */
  snow: boolean;
  /**
   * "take": the percentage is taken off the prices in the price list.
   * "already": the listed prices are already the reduced ones, so the website shows a higher
   * original price crossed out and keeps the listed price.
   */
  mode: "take" | "already";
};

export async function loadPromoContent(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key,value")
      .like("key", "promo.%");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value as string]));
  } catch (error) {
    console.error("Could not load the monthly offer", error);
    return {};
  }
}

const todayInUk = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now);

/** The offer to show right now, or null when it is switched off, empty or past its end date. */
export function promoFrom(content: Record<string, string>, now = new Date()): Promo | null {
  const enabled = /^(yes|on|true|1)$/i.test(text(content, "promo.enabled").trim());
  const message = text(content, "promo.text").trim();
  if (!enabled || !message) return null;
  const endsOn = /^\d{4}-\d{2}-\d{2}$/.test(text(content, "promo.ends").trim())
    ? text(content, "promo.ends").trim()
    : "";
  if (endsOn && todayInUk(now) > endsOn) return null;
  const percent = Math.min(
    90,
    Math.max(0, Math.round(Number(text(content, "promo.percent")) || 0)),
  );
  const theme = themeById(text(content, "promo.theme").trim());
  // Snow follows the theme unless the admin chose explicitly.
  const snowSetting = content["promo.snow"]?.trim();
  const snow = snowSetting ? /^(yes|on|true|1)$/i.test(snowSetting) : theme.snow;
  const mode = text(content, "promo.mode").trim() === "already" ? "already" : "take";
  return { text: message, percent, endsOn, theme: theme.id, snow, mode };
}

/** The price a customer pays: the listed price, minus the discount in "take" mode. */
export const promoPrice = (price: number, promo: Promo | null) =>
  promo && promo.percent > 0 && promo.mode === "take"
    ? Math.round((price * (100 - promo.percent)) / 100)
    : price;

/** The crossed-out original price to show next to the price, or null when there is no discount. */
export const promoWas = (price: number, promo: Promo | null): number | null => {
  if (!promo || promo.percent <= 0) return null;
  return promo.mode === "already" ? Math.round(price / (1 - promo.percent / 100)) : price;
};

export const PromoContext = createContext<Promo | null>(null);
export const usePromo = () => useContext(PromoContext);
