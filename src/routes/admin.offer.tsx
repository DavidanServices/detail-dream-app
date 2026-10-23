import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { text } from "@/data/page-text";
import { loadPromoContent, promoPrice } from "@/lib/promo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/offer")({ component: OfferPage });

const KEYS = ["promo.enabled", "promo.text", "promo.percent", "promo.ends"] as const;

function OfferPage() {
  const saved = useQuery({ queryKey: ["admin", "promo"], queryFn: loadPromoContent });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl">Monthly offer</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          A red strip at the very top of every page of the website, with the offer scrolling across
          it. If you set a discount, every package price on the website shows the old price crossed
          out and the new price, and the booking form uses it too.
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

  const pct = Math.min(90, Math.max(0, Math.round(Number(percent) || 0)));

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

  const endLabel = endsOn
    ? new Date(`${endsOn}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
    : "";

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

        <div className="space-y-2">
          <Label htmlFor="offer-text">Offer message</Label>
          <Input
            id="offer-text"
            maxLength={140}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Halloween offer: 15% off all packages"
          />
          <p className="text-xs text-muted-foreground">The text that scrolls across the strip.</p>
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

        <div className="flex justify-end border-t border-border pt-4">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save offer
          </Button>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <p className="text-sm font-medium">Preview</p>
        <div className="overflow-hidden border border-border bg-primary text-primary-foreground">
          <p className="truncate px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em]">
            {message || "Your offer message"}
            {endLabel && ` · Ends ${endLabel}`}
          </p>
        </div>
        {pct > 0 && (
          <div className="border border-border bg-card p-4 text-sm">
            <p className="text-muted-foreground">Example price on the website</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-heading text-3xl">
                £{promoPrice(230, { text: "", endsOn: "", percent: pct })}
              </span>
              <span className="text-muted-foreground line-through">£230</span>
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
