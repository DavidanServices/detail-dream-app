import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AdminPackage, AdminVehicleType } from "@/components/admin/PackageEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { appearsOn } from "@/lib/admin-sections";
import { promoPrice, type Promo } from "@/lib/promo";
import { supabase } from "@/lib/supabase";

type Props = { packages: AdminPackage[]; vehicleTypes: AdminVehicleType[]; promo: Promo | null };

// One table for every price: packages down the side, vehicle types across the top.
export function PriceTable({ packages, vehicleTypes, promo }: Props) {
  const queryClient = useQueryClient();

  const initial = useMemo(
    () => ({
      prices: Object.fromEntries(
        packages.map((p) => [
          p.id,
          Object.fromEntries(
            p.package_prices.map((x) => [x.vehicle_type_id, String(Number(x.price))]),
          ),
        ]),
      ) as Record<string, Record<string, string>>,
      active: Object.fromEntries(packages.map((p) => [p.id, p.active])) as Record<string, boolean>,
    }),
    [packages],
  );
  const [prices, setPrices] = useState(initial.prices);
  const [active, setActive] = useState(initial.active);

  const cell = (pid: string, vid: string) => (prices[pid]?.[vid] ?? "").trim();
  const cellChanged = (pid: string, vid: string) =>
    cell(pid, vid) !== (initial.prices[pid]?.[vid] ?? "");
  const changes = packages.reduce(
    (n, p) =>
      n +
      vehicleTypes.filter((v) => cellChanged(p.id, v.id)).length +
      (active[p.id] !== initial.active[p.id] ? 1 : 0),
    0,
  );

  const save = useMutation({
    mutationFn: async () => {
      for (const p of packages) {
        const upserts: { package_id: string; vehicle_type_id: string; price: number }[] = [];
        const deletes: string[] = [];
        for (const v of vehicleTypes) {
          if (!cellChanged(p.id, v.id)) continue;
          const raw = cell(p.id, v.id);
          if (raw === "") {
            deletes.push(v.id);
            continue;
          }
          const price = Number(raw);
          if (!Number.isFinite(price) || price < 0)
            throw new Error(`"${raw}" is not a valid price (${p.name}, ${v.label}).`);
          upserts.push({ package_id: p.id, vehicle_type_id: v.id, price });
        }
        if (upserts.length) {
          const { error } = await supabase!.from("package_prices").upsert(upserts);
          if (error) throw error;
        }
        if (deletes.length) {
          const { error } = await supabase!
            .from("package_prices")
            .delete()
            .eq("package_id", p.id)
            .in("vehicle_type_id", deletes);
          if (error) throw error;
        }
        if (active[p.id] !== initial.active[p.id]) {
          const { error } = await supabase!
            .from("packages")
            .update({ active: active[p.id] })
            .eq("id", p.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast.success("Prices saved. The website shows them straight away.");
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Package</th>
              {vehicleTypes.map((v) => (
                <th key={v.id} className="px-2 py-3 font-medium">
                  {v.label}
                  {!v.active && <span className="normal-case"> (hidden)</span>}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Shown on site</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr
                key={p.id}
                className={`border-b border-border last:border-0 ${active[p.id] ? "" : "opacity-60"}`}
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {appearsOn(p.id, p.featured).join(" · ")}
                  </p>
                </td>
                {vehicleTypes.map((v) => {
                  const raw = cell(p.id, v.id);
                  const n = Number(raw);
                  const sale = raw !== "" && Number.isFinite(n) ? promoPrice(n, promo) : n;
                  return (
                    <td key={v.id} className="px-2 py-3 align-top">
                      <div className="relative w-28">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          £
                        </span>
                        <Input
                          inputMode="decimal"
                          value={prices[p.id]?.[v.id] ?? ""}
                          placeholder="-"
                          aria-label={`${p.name}, ${v.label} price`}
                          onChange={(e) =>
                            setPrices((prev) => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], [v.id]: e.target.value },
                            }))
                          }
                          className={`pl-7 ${cellChanged(p.id, v.id) ? "border-primary ring-1 ring-primary/40" : ""}`}
                        />
                      </div>
                      {promo && promo.percent > 0 && raw !== "" && Number.isFinite(n) && (
                        <p className="mt-1 text-[11px] text-primary">Customers see £{sale}</p>
                      )}
                      {raw === "" && (
                        <p className="mt-1 text-[11px] text-muted-foreground">Not offered</p>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3 align-top">
                  <Switch
                    checked={active[p.id] ?? false}
                    onCheckedChange={(v) => setActive((prev) => ({ ...prev, [p.id]: v }))}
                    aria-label={`Show ${p.name} on the website`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Leave a price empty if that package is not offered for that vehicle type.
        </p>
        <div className="flex items-center gap-3">
          {changes > 0 && (
            <span className="text-xs text-primary">
              {changes} unsaved {changes === 1 ? "change" : "changes"}
            </span>
          )}
          <Button onClick={() => save.mutate()} disabled={save.isPending || changes === 0}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save prices
          </Button>
        </div>
      </div>
    </div>
  );
}
