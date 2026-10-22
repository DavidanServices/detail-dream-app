import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/ppf")({ component: PpfAdminPage });

type Settings = { name: string; description: string; tagline: string; features: string[] };
type SizeRow = {
  vehicle_type_id: string;
  title: string;
  blurb: string;
  price: number | string | null;
};
type ColorRow = {
  id: string;
  name: string;
  hex: string;
  finish: string;
  sort_order: number;
  active: boolean;
};
type Vehicle = { id: string; label: string };

function PpfAdminPage() {
  const data = useQuery({
    queryKey: ["admin", "ppf"],
    queryFn: async () => {
      const [settings, sizes, colors, vehicles] = await Promise.all([
        supabase!.from("ppf_settings").select("name,description,tagline,features").maybeSingle(),
        supabase!.from("ppf_sizes").select("*"),
        supabase!.from("ppf_colors").select("*").order("sort_order"),
        supabase!.from("vehicle_types").select("id,label").order("sort_order"),
      ]);
      const error = settings.error ?? sizes.error ?? colors.error ?? vehicles.error;
      if (error) throw error;
      return {
        settings: settings.data as Settings | null,
        sizes: sizes.data as SizeRow[],
        colors: colors.data as ColorRow[],
        vehicles: vehicles.data as Vehicle[],
      };
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl">Paint protection film</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything on the PPF page: description, packages by car size and the colour palette.
          Headlines and other texts are under <span className="text-foreground">Page texts</span>.
        </p>
      </div>
      {data.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {data.isError && (
        <p className="border border-border bg-card p-5 text-sm text-muted-foreground">
          Could not load the PPF data. If you have not run it yet, run the migration{" "}
          <code>20261025120000_ppf_presentation.sql</code> in the Supabase SQL Editor, then reload.
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
          <SizesForm
            key={JSON.stringify(data.data.sizes)}
            sizes={data.data.sizes}
            vehicles={data.data.vehicles}
          />
          <ColorsForm key={JSON.stringify(data.data.colors)} colors={data.data.colors} />
        </>
      )}
    </div>
  );
}

function SettingsForm({ settings }: { settings: Settings }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [features, setFeatures] = useState(settings.features.join("\n"));

  const save = useMutation({
    mutationFn: async () => {
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
        })
        .eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("PPF details saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "ppf"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl">Details</h2>
      <div className="grid gap-6 border border-border bg-card p-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Short tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>
            Benefits{" "}
            <span className="text-muted-foreground">
              (one per line, shown on the page and in every package)
            </span>
          </Label>
          <Textarea rows={8} value={features} onChange={(e) => setFeatures(e.target.value)} />
        </div>
        <div className="flex justify-end lg:col-span-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save details
          </Button>
        </div>
      </div>
    </section>
  );
}

function SizesForm({ sizes, vehicles }: { sizes: SizeRow[]; vehicles: Vehicle[] }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(
    vehicles.map((v) => {
      const row = sizes.find((s) => s.vehicle_type_id === v.id);
      return {
        vehicle_type_id: v.id,
        label: v.label,
        title: row?.title ?? "",
        blurb: row?.blurb ?? "",
        price: row?.price === null || row?.price === undefined ? "" : String(Number(row.price)),
      };
    }),
  );
  const patch = (id: string, change: Partial<(typeof rows)[number]>) =>
    setRows((prev) => prev.map((r) => (r.vehicle_type_id === id ? { ...r, ...change } : r)));

  const save = useMutation({
    mutationFn: async () => {
      const payload = rows.map((r) => {
        const raw = r.price.trim();
        const price = raw === "" ? null : Number(raw);
        if (price !== null && (!Number.isFinite(price) || price < 0))
          throw new Error(`Invalid price for ${r.label}.`);
        return {
          vehicle_type_id: r.vehicle_type_id,
          title: r.title.trim(),
          blurb: r.blurb.trim(),
          price,
        };
      });
      const { error } = await supabase!.from("ppf_sizes").upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("PPF packages saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "ppf"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl">Packages by car size</h2>
      <p className="text-sm text-muted-foreground">
        Leave the price empty to show &ldquo;Request a quote&rdquo;. Once you enter prices they
        appear as &ldquo;From £…&rdquo; on the page, the home page and the booking form.
      </p>
      <div className="space-y-4 border border-border bg-card p-5">
        {rows.map((r) => (
          <div
            key={r.vehicle_type_id}
            className="grid gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:grid-cols-[10rem_1fr_9rem]"
          >
            <p className="pt-2 text-xs uppercase tracking-wider text-muted-foreground">{r.label}</p>
            <div className="space-y-2">
              <Input
                value={r.title}
                maxLength={80}
                placeholder="Card title, e.g. Small car"
                onChange={(e) => patch(r.vehicle_type_id, { title: e.target.value })}
                aria-label={`${r.label} title`}
              />
              <Input
                value={r.blurb}
                maxLength={300}
                placeholder="Short description, e.g. Hatchbacks and compact cars"
                onChange={(e) => patch(r.vehicle_type_id, { blurb: e.target.value })}
                aria-label={`${r.label} description`}
              />
            </div>
            <Input
              value={r.price}
              inputMode="decimal"
              placeholder="Price (£)"
              onChange={(e) => patch(r.vehicle_type_id, { price: e.target.value })}
              aria-label={`${r.label} price`}
            />
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save packages
          </Button>
        </div>
      </div>
    </section>
  );
}

function ColorsForm({ colors }: { colors: ColorRow[] }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(colors.map((c) => ({ ...c, sort_order: String(c.sort_order) })));
  const [newName, setNewName] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "ppf"] });
  const patch = (id: string, change: Partial<(typeof rows)[number]>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...change } : r)));

  const save = useMutation({
    mutationFn: async () => {
      for (const r of rows) {
        if (!r.name.trim()) throw new Error("Every colour needs a name.");
        if (!/^#[0-9a-fA-F]{6}$/.test(r.hex))
          throw new Error(`"${r.name}": use a colour like #1a2b3c.`);
        const order = Number.parseInt(r.sort_order, 10);
        const { error } = await supabase!
          .from("ppf_colors")
          .update({
            name: r.name.trim(),
            hex: r.hex,
            finish: r.finish,
            active: r.active,
            sort_order: Number.isFinite(order) ? order : 0,
          })
          .eq("id", r.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Colours saved");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const id = slugify(newName);
      if (!id) throw new Error("Enter a colour name first.");
      const { error } = await supabase!.from("ppf_colors").insert({
        id,
        name: newName.trim(),
        hex: "#808080",
        finish: "gloss",
        sort_order: rows.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Colour added. Pick its shade and save.");
      setNewName("");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase!.from("ppf_colors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Colour deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl">Colour palette</h2>
      <p className="text-sm text-muted-foreground">
        Shown on the PPF page as swatches. Hide a colour with Visible off, or delete it. The shade
        is a guide only.
      </p>
      <div className="border border-border bg-card p-5">
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid items-center gap-3 sm:grid-cols-[auto_9rem_1fr_9rem_5rem_auto_auto]"
            >
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(r.hex) ? r.hex : "#808080"}
                onChange={(e) => patch(r.id, { hex: e.target.value })}
                aria-label={`${r.name} shade`}
                className="h-10 w-12 cursor-pointer rounded-sm border border-input bg-background p-1"
              />
              <Input
                value={r.hex}
                maxLength={7}
                onChange={(e) => patch(r.id, { hex: e.target.value })}
                className="font-mono"
                aria-label={`${r.name} hex`}
              />
              <Input
                value={r.name}
                maxLength={60}
                onChange={(e) => patch(r.id, { name: e.target.value })}
                aria-label="Colour name"
              />
              <select
                value={r.finish}
                onChange={(e) => patch(r.id, { finish: e.target.value })}
                aria-label={`${r.name} finish`}
                className="rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="gloss">Gloss</option>
                <option value="satin">Satin</option>
                <option value="matte">Matte</option>
              </select>
              <Input
                value={r.sort_order}
                inputMode="numeric"
                onChange={(e) => patch(r.id, { sort_order: e.target.value })}
                aria-label="Order"
              />
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={r.active} onCheckedChange={(v) => patch(r.id, { active: v })} />{" "}
                Visible
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => remove.mutate(r.id)}
                aria-label={`Delete ${r.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {rows.length === 0 && <p className="text-sm text-muted-foreground">No colours yet.</p>}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New colour, e.g. Sunset Orange"
              className="w-64"
            />
            <Button
              variant="outline"
              onClick={() => add.mutate()}
              disabled={add.isPending || !newName.trim()}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save colours
          </Button>
        </div>
      </div>
    </section>
  );
}
