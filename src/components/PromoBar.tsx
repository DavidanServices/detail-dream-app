import { useEffect, useState } from "react";
import { PromoStrip } from "@/components/PromoStrip";
import type { Promo } from "@/lib/promo";

const dismissedKey = (promo: Promo) => `promo-dismissed:${promo.text}`;

// Offer strip above the header. A visitor can close it; it stays closed for that browser session.
export function PromoBar({ promo }: { promo: Promo }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(dismissedKey(promo)) === "1");
    } catch {
      /* storage can be blocked */
    }
  }, [promo]);

  if (dismissed) return null;

  const close = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(dismissedKey(promo), "1");
    } catch {
      /* storage can be blocked */
    }
  };

  return <PromoStrip promo={promo} onClose={close} />;
}
