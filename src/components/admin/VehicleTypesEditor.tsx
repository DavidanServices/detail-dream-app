import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import type { AdminVehicleType } from "@/components/admin/PackageEditor";

export function VehicleTypesEditor({ vehicleTypes }: { vehicleTypes: AdminVehicleType[] }) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(
    vehicleTypes.map((v) => ({ ...v, sort_order: String(v.sort_order) })),
  );
  const [newLabel, setNewLabel] = useState("");

  const patch = (id: string, change: Partial<(typeof rows)[number]>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...change } : r)));

  const save = useMutation({
    mutationFn: async () => {
      for (const r of rows) {
        if (!r.label.trim()) throw new Error("Every vehicle type needs a name.");
        const order = Number.parseInt(r.sort_order, 10);
        const { error } = await supabase!
          .from("vehicle_types")
          .update({
            label: r.label.trim(),
            hint: r.hint.trim(),
            active: r.active,
            sort_order: Number.isFinite(order) ? order : 0,
          })
          .eq("id", r.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Vehicle types saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const add = useMutation({
    mutationFn: async () => {
      const id = slugify(newLabel);
      if (!id) throw new Error("Enter a name first.");
      const { error } = await supabase!
        .from("vehicle_types")
        .insert({ id, label: newLabel.trim(), sort_order: rows.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vehicle type added. Set prices for it in each package.");
      setNewLabel("");
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="border border-border bg-card p-5">
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="grid items-center gap-3 sm:grid-cols-[1fr_1.5fr_5rem_auto]">
            <Input
              value={r.label}
              maxLength={60}
              onChange={(e) => patch(r.id, { label: e.target.value })}
              aria-label="Vehicle type name"
            />
            <Input
              value={r.hint}
              maxLength={120}
              onChange={(e) => patch(r.id, { hint: e.target.value })}
              placeholder="Short hint, e.g. Small & compact cars"
              aria-label="Hint"
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
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New vehicle type, e.g. Van"
            className="w-56"
          />
          <Button
            variant="outline"
            onClick={() => add.mutate()}
            disabled={add.isPending || !newLabel.trim()}
          >
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save vehicle types
        </Button>
      </div>
    </div>
  );
}
