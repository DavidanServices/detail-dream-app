import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ExternalLink, Loader2, Trash2 } from "lucide-react";
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
import { appearsOn, packagePage } from "@/lib/admin-sections";
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
  // Vehicle types this package has a price for: only those can have their own card text.
  const pricedIds = new Set(pkg.package_prices.map((p) => p.vehicle_type_id));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });

  const save = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("The package needs a name.");
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
      // Prices are edited in the price list; here only the card texts of existing prices change.
      for (const v of vehicleTypes.filter((x) => pricedIds.has(x.id))) {
        const { error: e } = await supabase!
          .from("package_prices")
          .update({
            title: tiers[v.id]?.title.trim() || null,
            blurb: tiers[v.id]?.blurb.trim() || null,
          })
          .eq("package_id", pkg.id)
          .eq("vehicle_type_id", v.id);
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

  const page = packagePage(pkg.id);
  const prices = vehicleTypes
    .filter((v) => pricedIds.has(v.id))
    .map((v) => `£${Number(pkg.package_prices.find((x) => x.vehicle_type_id === v.id)?.price)}`)
    .join(" · ");

  return (
    <details
      className={`group border bg-card ${active ? "border-border" : "border-dashed border-border opacity-80"}`}
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-2xl">{name || pkg.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {appearsOn(pkg.id, featured).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {prices && <span className="text-muted-foreground">{prices}</span>}
          {!active && (
            <span className="rounded-sm border border-border px-2 py-0.5 text-muted-foreground">
              Hidden
            </span>
          )}
          {popular && (
            <span className="rounded-sm bg-primary/15 px-2 py-0.5 text-primary">Most popular</span>
          )}
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            Edit <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </span>
        </div>
      </summary>

      <div className="border-t border-border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Prices are changed in the <strong>Price list</strong> at the top of this page. Here you
            edit the texts and where this package is shown.
          </p>
          <a
            href={page.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            See it on the site <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${pkg.id}-name`}>Package name</Label>
              <Input
                id={`${pkg.id}-name`}
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={2}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The short text under the name on the package cards.
              </p>
            </div>
            <div className="space-y-2">
              <Label>
                Short tagline <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input maxLength={120} value={tagline} onChange={(e) => setTagline(e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Used instead of the description on the wide rows of the home page.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 border border-border bg-background/50 p-4">
              <p className="text-sm font-medium">Where and how it is shown</p>
              <label className="flex items-start gap-3 text-sm">
                <Switch checked={active} onCheckedChange={setActive} className="mt-0.5" />
                <span>
                  Visible on the website
                  <span className="block text-xs text-muted-foreground">
                    Off hides it everywhere (pages, home page, booking form).
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <Switch checked={popular} onCheckedChange={setPopular} className="mt-0.5" />
                <span>
                  &ldquo;Most popular&rdquo; tag
                  <span className="block text-xs text-muted-foreground">
                    Adds a red tag and a highlighted border on its card.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <Switch checked={featured} onCheckedChange={setFeatured} className="mt-0.5" />
                <span>
                  Large card on the home page
                  <span className="block text-xs text-muted-foreground">
                    On: big card with its own price. Off: a slim row lower on the page.
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-3 text-sm">
                <Input
                  id={`${pkg.id}-order`}
                  inputMode="numeric"
                  className="w-20"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  aria-label="Display order"
                />
                <label htmlFor={`${pkg.id}-order`}>
                  Display order
                  <span className="block text-xs text-muted-foreground">
                    1 is shown first, then 2, 3 and so on.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Label>What&apos;s included</Label>
          <HighlightsEditor items={items} onChange={setItems} />
          <p className="text-xs text-muted-foreground">
            Each line is a tick on the package cards. On the Interior and Exterior pages the lines
            with a short title also appear as the icon grid.
          </p>
        </div>

        <details className="mt-6 border border-border bg-background/50 p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Card title and text per vehicle type (optional)
          </summary>
          <p className="mt-2 text-xs text-muted-foreground">
            Used on the Interior and Exterior pages, where each vehicle type has its own card.
            Vehicle types without a price are not listed here.
          </p>
          <div className="mt-3 space-y-4">
            {vehicleTypes
              .filter((v) => pricedIds.has(v.id))
              .map((v) => (
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
                  The package and all its prices are removed from the website. To hide it
                  temporarily, switch &ldquo;Visible on the website&rdquo; off instead.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => remove.mutate()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save {name}
          </Button>
        </div>
      </div>
    </details>
  );
}
