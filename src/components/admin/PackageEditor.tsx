import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HighlightsEditor } from "@/components/admin/HighlightsEditor";
import { Textarea } from "@/components/ui/textarea";
import type { Highlight } from "@/data/icons";
import { supabase } from "@/lib/supabase";

export type AdminPackage = {
  id: string;
  name: string;
  description: string;
  tagline: string | null;
  features: string[];
  highlights?: Highlight[] | null;
  popular: boolean;
  featured: boolean;
  sort_order: number;
  active: boolean;
  package_prices: {
    vehicle_type_id: string;
    price: number | string;
    title?: string | null;
    blurb?: string | null;
  }[];
};

export type AdminVehicleType = {
  id: string;
  label: string;
  hint: string;
  sort_order: number;
  active: boolean;
};

type Props = { pkg: AdminPackage; vehicleTypes: AdminVehicleType[] };

export function PackageEditor({ pkg, vehicleTypes }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(pkg.name);
  const [description, setDescription] = useState(pkg.description);
  const [tagline, setTagline] = useState(pkg.tagline ?? "");
  // Items with icon + title + text. Packages saved before icons existed start from their plain lines.
  const [items, setItems] = useState<Highlight[]>(() =>
    pkg.highlights && pkg.highlights.length > 0
      ? pkg.highlights
      : pkg.features.map((text) => ({ icon: "check", title: "", text })),
  );
  const [tiers, setTiers] = useState<Record<string, { title: string; blurb: string }>>(() =>
    Object.fromEntries(
      pkg.package_prices.map((p) => [
        p.vehicle_type_id,
        { title: p.title ?? "", blurb: p.blurb ?? "" },
      ]),
    ),
  );
  const [popular, setPopular] = useState(pkg.popular);
  const [featured, setFeatured] = useState(pkg.featured);
  const [active, setActive] = useState(pkg.active);
  const [order, setOrder] = useState(String(pkg.sort_order));
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(pkg.package_prices.map((p) => [p.vehicle_type_id, String(Number(p.price))])),
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });

  const save = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("The package needs a name.");
      const toUpsert: {
        package_id: string;
        vehicle_type_id: string;
        price: number;
        title: string | null;
        blurb: string | null;
      }[] = [];
      const toDelete: string[] = [];
      for (const v of vehicleTypes) {
        const raw = (prices[v.id] ?? "").trim();
        if (raw === "") {
          toDelete.push(v.id);
          continue;
        }
        const price = Number(raw);
        if (!Number.isFinite(price) || price < 0) throw new Error(`Invalid price for ${v.label}.`);
        toUpsert.push({
          package_id: pkg.id,
          vehicle_type_id: v.id,
          price,
          title: tiers[v.id]?.title.trim() || null,
          blurb: tiers[v.id]?.blurb.trim() || null,
        });
      }
      const cleanItems = items
        .map((item) => ({ icon: item.icon, title: item.title.trim(), text: item.text.trim() }))
        .filter((item) => item.text);
      const sortOrder = Number.parseInt(order, 10);
      const { error } = await supabase!
        .from("packages")
        .update({
          name: name.trim(),
          description: description.trim(),
          tagline: tagline.trim() || null,
          features: cleanItems.map((item) => item.text),
          highlights: cleanItems,
          popular,
          featured,
          active,
          sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        })
        .eq("id", pkg.id);
      if (error) throw error;
      if (toUpsert.length) {
        const { error: e } = await supabase!.from("package_prices").upsert(toUpsert);
        if (e) throw e;
      }
      if (toDelete.length) {
        const { error: e } = await supabase!
          .from("package_prices")
          .delete()
          .eq("package_id", pkg.id)
          .in("vehicle_type_id", toDelete);
        if (e) throw e;
      }
    },
    onSuccess: () => {
      toast.success(`${name} saved`);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase!.from("packages").delete().eq("id", pkg.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Package deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div
      className={`border bg-card p-5 ${active ? "border-border" : "border-dashed border-border opacity-80"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="h-auto border-0 bg-transparent px-0 font-heading text-2xl shadow-none focus-visible:ring-0"
            aria-label="Package name"
          />
          <p className="font-mono text-[11px] text-muted-foreground">id: {pkg.id}</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <label className="flex items-center gap-2">
            <Switch checked={active} onCheckedChange={setActive} /> Visible
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={popular} onCheckedChange={setPopular} /> Most popular
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={featured} onCheckedChange={setFeatured} /> On home page
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={2}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Short tagline{" "}
              <span className="text-muted-foreground">(optional, used in wide home rows)</span>
            </Label>
            <Input maxLength={120} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>What&apos;s included</Label>
            <HighlightsEditor items={items} onChange={setItems} />
            <p className="text-xs text-muted-foreground">
              Shown as the list on each package card and as the icon grid on the Interior and
              Exterior pages.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Price per vehicle type (£)</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {vehicleTypes.map((v) => (
                <div key={v.id} className="space-y-1">
                  <Label htmlFor={`${pkg.id}-${v.id}`} className="text-xs text-muted-foreground">
                    {v.label}
                    {!v.active && " (hidden)"}
                  </Label>
                  <Input
                    id={`${pkg.id}-${v.id}`}
                    inputMode="decimal"
                    placeholder="Not offered"
                    value={prices[v.id] ?? ""}
                    onChange={(e) => setPrices((prev) => ({ ...prev, [v.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Leave a price empty to hide that vehicle type for this package.
            </p>
            <details className="mt-4 border border-border bg-background/50 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Card text per vehicle type (optional)
              </summary>
              <div className="mt-3 space-y-4">
                {vehicleTypes.map((v) => (
                  <div key={v.id} className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {v.label}
                    </p>
                    <Input
                      value={tiers[v.id]?.title ?? ""}
                      maxLength={80}
                      placeholder={`Card title, e.g. ${v.label} ${name}`}
                      onChange={(e) =>
                        setTiers((prev) => ({
                          ...prev,
                          [v.id]: { title: e.target.value, blurb: prev[v.id]?.blurb ?? "" },
                        }))
                      }
                      aria-label={`${v.label} card title`}
                    />
                    <Textarea
                      rows={2}
                      maxLength={300}
                      value={tiers[v.id]?.blurb ?? ""}
                      placeholder="Short description for this vehicle type"
                      onChange={(e) =>
                        setTiers((prev) => ({
                          ...prev,
                          [v.id]: { title: prev[v.id]?.title ?? "", blurb: e.target.value },
                        }))
                      }
                      aria-label={`${v.label} card description`}
                    />
                  </div>
                ))}
              </div>
            </details>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${pkg.id}-order`}>Display order</Label>
            <Input
              id={`${pkg.id}-order`}
              inputMode="numeric"
              className="w-24"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {pkg.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                The package and all its prices are removed from the website. To hide it temporarily,
                switch Visible off instead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => remove.mutate()}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save package
        </Button>
      </div>
    </div>
  );
}
