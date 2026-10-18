import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/ppf")({ component: PpfAdminPage });

type Settings = {
  name: string;
  description: string;
  tagline: string;
  features: string[];
  starting_from: number | string;
  full_car_price: number | string;
};
type PanelRow = {
  id: string;
  name: string;
  price: number | string;
  sort_order: number;
  active: boolean;
};

function PpfAdminPage() {
  const data = useQuery({
    queryKey: ["admin", "ppf"],
    queryFn: async () => {
      const [settings, panels] = await Promise.all([
        supabase!.from("ppf_settings").select("*").maybeSingle(),
        supabase!.from("ppf_panels").select("*").order("sort_order"),
      ]);
      if (settings.error) throw settings.error;
      if (panels.error) throw panels.error;
      return { settings: settings.data as Settings | null, panels: panels.data as PanelRow[] };
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl">PPF configurator</h1>
        <p className="mt-2 text-muted-foreground">
          Prices used by the interactive paint protection film page.
        </p>
      </div>
      {data.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {data.isError && (
        <p className="text-sm text-destructive">
          Could not load PPF settings. Check that you are signed in as an admin.
        </p>
      )}
      {data.data && (
        <>
          {data.data.settings ? (
            <SettingsForm key={JSON.stringify(data.data.settings)} settings={data.data.settings} />
          ) : (
            <p className="text-sm text-destructive">
              The ppf_settings row is missing. Re-run the seed part of the SQL setup.
            </p>
          )}
          <PanelsForm key={JSON.stringify(data.data.panels)} panels={data.data.panels} />
        </>
      )}
    </div>
  );
}

function SettingsForm({ settings }: { settings: Settings }) {
  const queryClient = useQueryClient();
  const [startingFrom, setStartingFrom] = useState(String(Number(settings.starting_from)));
  const [fullCar, setFullCar] = useState(String(Number(settings.full_car_price)));
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [features, setFeatures] = useState(settings.features.join("\n"));

  const save = useMutation({
    mutationFn: async () => {
      const from = Number(startingFrom);
      const full = Number(fullCar);
      if (!Number.isFinite(from) || from < 0 || !Number.isFinite(full) || full < 0)
        throw new Error("Enter valid prices.");
      const { error } = await supabase!
        .from("ppf_settings")
        .update({
          name: name.trim(),
          tagline: tagline.trim(),
          description: description.trim(),
          features: features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          starting_from: from,
          full_car_price: full,
        })
        .eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("PPF settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "ppf"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl">Pricing & description</h2>
      <div className="grid gap-6 border border-border bg-card p-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ppf-from">Starting price / install base (£)</Label>
              <Input
                id="ppf-from"
                inputMode="decimal"
                value={startingFrom}
                onChange={(e) => setStartingFrom(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Shown as &ldquo;from&rdquo; and added to every panel selection.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ppf-full">Full car price (£)</Label>
              <Input
                id="ppf-full"
                inputMode="decimal"
                value={fullCar}
                onChange={(e) => setFullCar(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Fixed price when the whole car is selected.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Short tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>
              What&apos;s included <span className="text-muted-foreground">(one per line)</span>
            </Label>
            <Textarea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end lg:col-span-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save settings
          </Button>
        </div>
      </div>
    </section>
  );
}

function PanelsForm({ panels }: { panels: PanelRow[] }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(
    panels.map((p) => ({ ...p, price: String(Number(p.price)), sort_order: String(p.sort_order) })),
  );

  const patch = (id: string, change: Partial<(typeof rows)[number]>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...change } : r)));

  const save = useMutation({
    mutationFn: async () => {
      for (const r of rows) {
        const price = Number(r.price);
        if (!r.name.trim() || !Number.isFinite(price) || price < 0)
          throw new Error(`Check the name and price for ${r.id}.`);
        const order = Number.parseInt(r.sort_order, 10);
        const { error } = await supabase!
          .from("ppf_panels")
          .update({
            name: r.name.trim(),
            price,
            active: r.active,
            sort_order: Number.isFinite(order) ? order : 0,
          })
          .eq("id", r.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Panel prices saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "ppf"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl">Panel prices</h2>
      <p className="text-sm text-muted-foreground">
        Panels are tied to the clickable areas on the car images, so you can rename, reprice,
        reorder or hide them, but not add new ones here.
      </p>
      <div className="border border-border bg-card p-5">
        <div className="hidden gap-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-[1.5fr_8rem_5rem_auto]">
          <span>Panel</span>
          <span>Price (£)</span>
          <span>Order</span>
          <span>Visible</span>
        </div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="grid items-center gap-3 sm:grid-cols-[1.5fr_8rem_5rem_auto]">
              <Input
                value={r.name}
                maxLength={60}
                onChange={(e) => patch(r.id, { name: e.target.value })}
                aria-label={`${r.id} name`}
              />
              <Input
                value={r.price}
                inputMode="decimal"
                onChange={(e) => patch(r.id, { price: e.target.value })}
                aria-label={`${r.name} price`}
              />
              <Input
                value={r.sort_order}
                inputMode="numeric"
                onChange={(e) => patch(r.id, { sort_order: e.target.value })}
                aria-label={`${r.name} order`}
              />
              <Switch
                checked={r.active}
                onCheckedChange={(v) => patch(r.id, { active: v })}
                aria-label={`${r.name} visible`}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end border-t border-border pt-4">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save panel prices
          </Button>
        </div>
      </div>
    </section>
  );
}
