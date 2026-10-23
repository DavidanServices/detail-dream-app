import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PromoStrip } from "@/components/PromoStrip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { text } from "@/data/page-text";
import { promoThemes, themeById, type PromoThemeId } from "@/data/promo-themes";
import { loadPromoContent, promoPrice, promoWas, type Promo } from "@/lib/promo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/offer")({ component: OfferPage });

const KEYS = [
  "promo.enabled",
  "promo.text",
  "promo.percent",
  "promo.ends",
  "promo.theme",
  "promo.snow",
  "promo.mode",
] as const;

function OfferPage() {
  const saved = useQuery({ queryKey: ["admin", "promo"], queryFn: loadPromoContent });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl">Monthly offer</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A strip at the very top of every page of the website, with the offer scrolling across it.
          Pick a look (Christmas, Black Friday...), write the message and set a discount. If you set
          a discount, every package price on the website shows the old price crossed out and the new
          price, and the booking form uses it too.
        </p>
      </div>
      {saved.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {saved.isError && <p className="text-sm text-destructive">Could not load the offer.</p>}
      {saved.data && <OfferForm key={JSON.stringify(saved.data)} saved={saved.data} />}
    </div>
  );
}

function OfferForm({ saved }: { saved: Record<string, string> }) {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(/^(yes|on|true|1)$/i.test(text(saved, "promo.enabled")));
  const [message, setMessage] = useState(text(saved, "promo.text"));
  const [percent, setPercent] = useState(text(saved, "promo.percent"));
  const [endsOn, setEndsOn] = useState(text(saved, "promo.ends"));
  const [themeId, setThemeId] = useState<PromoThemeId>(themeById(text(saved, "promo.theme")).id);
  const [snow, setSnow] = useState(
    saved["promo.snow"] ? /^(yes|on|true|1)$/i.test(saved["promo.snow"]) : themeById(themeId).snow,
  );

  const [mode, setMode] = useState<Promo["mode"]>(
    text(saved, "promo.mode") === "already" ? "already" : "take",
  );

  const pct = Math.min(90, Math.max(0, Math.round(Number(percent) || 0)));

  // Picking a look also suggests its message and snow setting, unless the message was written by hand.
  const chooseTheme = (id: PromoThemeId) => {
    const previous = themeById(themeId);
    const next = themeById(id);
    if (!message.trim() || message === previous.message(pct)) setMessage(next.message(pct));
    setSnow(next.snow);
    setThemeId(id);
  };

  const save = useMutation({
    mutationFn: async () => {
      if (enabled && !message.trim()) throw new Error("Write the offer message first.");
      if (percent.trim() !== "" && (!Number.isFinite(Number(percent)) || pct !== Number(percent)))
        throw new Error("The discount must be a whole number between 0 and 90.");
      const values: Record<(typeof KEYS)[number], string> = {
        "promo.enabled": enabled ? "yes" : "no",
        "promo.text": message.trim(),
        "promo.percent": String(pct),
        "promo.ends": endsOn.trim(),
        "promo.theme": themeId,
        "promo.snow": snow ? "yes" : "no",
        "promo.mode": mode,
      };
      for (const key of KEYS) {
        const value = values[key];
        // An empty value goes back to its default.
        if (value === "") {
          const { error } = await supabase!.from("site_content").delete().eq("key", key);
          if (error) throw error;
        } else {
          const { error } = await supabase!.from("site_content").upsert({ key, value });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast.success(
        enabled ? "Offer saved. It is live on the website." : "Offer saved (switched off).",
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "promo"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const preview: Promo = {
    text: message.trim() || "Your offer message",
    percent: pct,
    endsOn,
    theme: themeId,
    snow,
    mode,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-6 border border-border bg-card p-6">
        <label className="flex items-start gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} className="mt-0.5" />
          <span className="text-sm">
            <span className="font-medium">Show the offer on the website</span>
            <span className="block text-muted-foreground">
              Off hides the strip and the discount everywhere.
            </span>
          </span>
        </label>

        <div className="space-y-3">
          <Label>Look of the strip</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {promoThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => chooseTheme(t.id)}
                aria-pressed={themeId === t.id}
                className={`overflow-hidden border text-left transition-colors ${
                  themeId === t.id ? "border-primary ring-2 ring-primary/40" : "border-border"
                }`}
              >
                <span
                  className="block px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: t.bg, color: t.fg, borderBottom: `2px solid ${t.accent}` }}
                >
                  {t.separator} {t.label} {t.separator}
                </span>
                <span className="block px-3 py-1.5 text-xs text-muted-foreground">
                  {t.snow ? "With falling snow" : "Plain"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-3">
          <Switch checked={snow} onCheckedChange={setSnow} className="mt-0.5" />
          <span className="text-sm">
            <span className="font-medium">Falling snowflakes</span>
            <span className="block text-muted-foreground">
              Snowflakes drift down from the strip. Works with any look; it is on by default for
              Christmas.
            </span>
          </span>
        </label>

        <div className="space-y-2">
          <Label htmlFor="offer-text">Offer message</Label>
          <Input
            id="offer-text"
            maxLength={140}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={themeById(themeId).message(pct)}
          />
          <p className="text-xs text-muted-foreground">
            The text that scrolls across the strip.{" "}
            <button
              type="button"
              onClick={() => setMessage(themeById(themeId).message(pct))}
              className="font-medium text-primary underline"
            >
              Use the suggested message for {themeById(themeId).label}
            </button>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="offer-percent">Discount on all packages (%)</Label>
            <Input
              id="offer-percent"
              inputMode="numeric"
              className="w-28"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use 0 to show the strip without changing any price.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="offer-ends">Last day of the offer</Label>
            <Input
              id="offer-ends"
              type="date"
              className="w-44"
              value={endsOn}
              onChange={(e) => setEndsOn(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              It switches itself off after this day. Leave empty to keep it on until you turn it
              off.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label>How should the discount work?</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  id: "take",
                  title: "Take the discount off my prices",
                  text: "The customer pays the percentage less than the price in the price list. The list price is shown crossed out.",
                },
                {
                  id: "already",
                  title: "My prices are already reduced",
                  text: "The prices in the price list stay exactly as they are. The website shows a higher original price crossed out, calculated from the percentage.",
                },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setMode(o.id)}
                aria-pressed={mode === o.id}
                className={`border p-4 text-left text-sm transition-colors ${
                  mode === o.id ? "border-primary ring-2 ring-primary/40" : "border-border"
                }`}
              >
                <span className="block font-medium">{o.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{o.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save offer
          </Button>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-medium">Preview</p>
        <div className="h-28">
          <PromoStrip promo={preview} />
        </div>
        {pct > 0 && (
          <div className="border border-border bg-card p-4 text-sm">
            <p className="text-muted-foreground">Example: a package listed at £230</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-3xl">£{promoPrice(230, preview)}</span>
              <span className="text-muted-foreground line-through">£{promoWas(230, preview)}</span>
              <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                -{pct}%
              </span>
            </p>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {enabled
            ? "The offer is shown on the website."
            : "The offer is switched off and is not visible to customers."}
        </p>
      </aside>
    </div>
  );
}
