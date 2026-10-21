import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export type AdminAddon = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  sort_order: number;
  active: boolean;
  package_id?: string | null;
  starts_from?: boolean;
  note?: string | null;
};

export function AddonsEditor({
  addons,
  packages,
}: {
  addons: AdminAddon[];
  packages: { id: string; name: string }[];
}) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(
    addons.map((a) => ({
      ...a,
      price: String(Number(a.price)),
      sort_order: String(a.sort_order),
      package_id: a.package_id ?? "",
      starts_from: a.starts_from ?? false,
      note: a.note ?? "",
    })),
  );
  const [newName, setNewName] = useState("");

  const patch = (id: string, change: Partial<(typeof rows)[number]>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...change } : r)));
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });

  const save = useMutation({
    mutationFn: async () => {
      for (const r of rows) {
        const price = Number(r.price);
        if (!r.name.trim() || !Number.isFinite(price) || price < 0)
          throw new Error(`Check the name and price for ${r.id}.`);
        const order = Number.parseInt(r.sort_order, 10);
        const { error } = await supabase!
          .from("addons")
          .update({
            name: r.name.trim(),
            description: r.description.trim(),
            price,
            active: r.active,
            package_id: r.package_id || null,
            starts_from: r.starts_from,
            note: r.note.trim() || null,
            sort_order: Number.isFinite(order) ? order : 0,
          })
          .eq("id", r.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Optional extras saved");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const id = slugify(newName);
      if (!id) throw new Error("Enter a name first.");
      const { error } = await supabase!
        .from("addons")
        .insert({ id, name: newName.trim(), price: 0, sort_order: rows.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Extra added. Set its price and description, then save.");
      setNewName("");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="border border-border bg-card p-5">
      <div className="space-y-5">
        {rows.map((r) => (
          <div
            key={r.id}
            className="grid gap-3 border-b border-border pb-5 last:border-0 last:pb-0 sm:grid-cols-[1fr_7rem_5rem_auto]"
          >
            <div className="space-y-2">
              <Input
                value={r.name}
                maxLength={80}
                onChange={(e) => patch(r.id, { name: e.target.value })}
                aria-label="Extra name"
              />
              <Textarea
                rows={3}
                maxLength={300}
                value={r.description}
                onChange={(e) => patch(r.id, { description: e.target.value })}
                aria-label="Description"
              />
            </div>
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
              aria-label="Order"
            />
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={r.active} onCheckedChange={(v) => patch(r.id, { active: v })} />{" "}
              Visible
            </label>
            <div className="grid gap-3 sm:col-span-4 sm:grid-cols-[1fr_auto_1fr]">
              <label className="space-y-1 text-xs text-muted-foreground">
                Shown with package
                <select
                  value={r.package_id}
                  onChange={(e) => patch(r.id, { package_id: e.target.value })}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Any package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <Switch
                  checked={r.starts_from}
                  onCheckedChange={(v) => patch(r.id, { starts_from: v })}
                />{" "}
                Starting rate (&ldquo;From £&rdquo;)
              </label>
              <label className="space-y-1 text-xs text-muted-foreground">
                Note <span>(optional, e.g. depending on car size)</span>
                <Input
                  value={r.note}
                  maxLength={120}
                  onChange={(e) => patch(r.id, { note: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No optional extras yet.</p>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New extra, e.g. Pet hair removal"
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
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save optional extras
        </Button>
      </div>
    </div>
  );
}
