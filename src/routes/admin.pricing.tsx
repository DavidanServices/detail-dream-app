import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  PackageEditor,
  type AdminPackage,
  type AdminVehicleType,
} from "@/components/admin/PackageEditor";
import { AddonsEditor, type AdminAddon } from "@/components/admin/AddonsEditor";
import { VehicleTypesEditor } from "@/components/admin/VehicleTypesEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/pricing")({ component: PricingPage });

function PricingPage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");

  const data = useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: async () => {
      const [vehicles, packages, addons] = await Promise.all([
        supabase!.from("vehicle_types").select("*").order("sort_order"),
        supabase!
          .from("packages")
          .select("*,package_prices(vehicle_type_id,price,title,blurb)")
          .order("sort_order"),
        supabase!.from("addons").select("*").order("sort_order"),
      ]);
      if (vehicles.error) throw vehicles.error;
      if (packages.error) throw packages.error;
      return {
        vehicleTypes: vehicles.data as AdminVehicleType[],
        packages: packages.data as AdminPackage[],
        // The add-ons table comes from a later migration: show a hint instead of failing the page.
        addons: addons.error ? null : (addons.data as AdminAddon[]),
      };
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const id = slugify(newName);
      if (!id) throw new Error("Enter a package name first.");
      const { error } = await supabase!
        .from("packages")
        .insert({ id, name: newName.trim(), sort_order: (data.data?.packages.length ?? 0) + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Package added. Fill in its details and prices below.");
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl">Packages & prices</h1>
        <p className="mt-2 text-muted-foreground">
          Changes go live on the website straight after you press Save. The services page, home
          page, booking form and price lists all read from here.
        </p>
      </div>

      {data.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {data.isError && (
        <p className="text-sm text-destructive">
          Could not load pricing. Check that you are signed in as an admin.
        </p>
      )}

      {data.data && (
        <>
          <section className="space-y-4">
            <h2 className="font-heading text-2xl">Vehicle types</h2>
            <VehicleTypesEditor
              key={JSON.stringify(data.data.vehicleTypes)}
              vehicleTypes={data.data.vehicleTypes}
            />
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-2xl">Packages</h2>
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New package name"
                  className="w-56"
                />
                <Button
                  variant="outline"
                  onClick={() => add.mutate()}
                  disabled={add.isPending || !newName.trim()}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add package
                </Button>
              </div>
            </div>
            <div className="space-y-5">
              {data.data.packages.map((pkg) => (
                <PackageEditor
                  key={`${pkg.id}:${JSON.stringify(pkg.package_prices)}:${pkg.name}`}
                  pkg={pkg}
                  vehicleTypes={data.data.vehicleTypes}
                />
              ))}
              {data.data.packages.length === 0 && (
                <p className="text-sm text-muted-foreground">No packages yet. Add one above.</p>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-2xl">Optional extras</h2>
            {data.data.addons ? (
              <AddonsEditor
                key={JSON.stringify(data.data.addons)}
                addons={data.data.addons}
                packages={data.data.packages.map((p) => ({ id: p.id, name: p.name }))}
              />
            ) : (
              <p className="border border-border bg-card p-5 text-sm text-muted-foreground">
                Optional extras are not set up yet. Run the migration{" "}
                <code>20261022120000_interior_pricing_addons.sql</code> in the Supabase SQL Editor.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
