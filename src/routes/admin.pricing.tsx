import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  PackageEditor,
  type AdminPackage,
  type AdminVehicleType,
} from "@/components/admin/PackageEditor";
import { AddonsEditor, type AdminAddon } from "@/components/admin/AddonsEditor";
import { VehicleTypesEditor } from "@/components/admin/VehicleTypesEditor";
import { Button } from "@/components/ui/button";
import { PriceTable } from "@/components/admin/PriceTable";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/admin";
import { loadPromoContent, promoFrom } from "@/lib/promo";
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

  // The running offer, so the price list can show what customers see after the discount.
  const promoContent = useQuery({ queryKey: ["admin", "promo"], queryFn: loadPromoContent });
  const promo = promoContent.data ? promoFrom(promoContent.data) : null;

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
    <div className="space-y-12">
      <div>
        <h1 className="font-heading text-4xl">Prices & packages</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Everything you change here goes live on the website as soon as you press Save. The home
          page, the Exterior and Interior pages and the booking form all read from this page.
        </p>
        <ol className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <li className="border border-border bg-card p-4">
            <p className="font-medium">1. Price list</p>
            <p className="mt-1 text-muted-foreground">
              Change prices and switch packages on or off. One Save for the whole table.
            </p>
          </li>
          <li className="border border-border bg-card p-4">
            <p className="font-medium">2. Packages</p>
            <p className="mt-1 text-muted-foreground">
              Open a package to edit its name, texts, what&apos;s included and where it shows.
            </p>
          </li>
          <li className="border border-border bg-card p-4">
            <p className="font-medium">3. Optional extras</p>
            <p className="mt-1 text-muted-foreground">
              Add-ons customers can tick, like the engine bay clean.
            </p>
          </li>
        </ol>
        {promo && (
          <p className="mt-4 border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm">
            The offer &ldquo;{promo.text}&rdquo; is running: customers see {promo.percent}% off
            every price below. Change it in{" "}
            <Link to="/admin/offer" className="font-medium text-primary underline">
              Offer
            </Link>
            .
          </p>
        )}
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
            <div>
              <h2 className="font-heading text-2xl">1. Price list</h2>
              <p className="text-sm text-muted-foreground">
                The price a customer sees as &ldquo;from £…&rdquo; for each vehicle type.
              </p>
            </div>
            <PriceTable
              key={JSON.stringify(
                data.data.packages.map((p) => [p.id, p.active, p.package_prices]),
              )}
              packages={data.data.packages}
              vehicleTypes={data.data.vehicleTypes.filter((v) => v.active)}
              promo={promo}
            />
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl">2. Packages</h2>
                <p className="text-sm text-muted-foreground">
                  Click a package to open it. Each one has its own Save button.
                </p>
              </div>
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
            <div className="space-y-3">
              {data.data.packages.map((pkg) => (
                <PackageEditor
                  key={`${pkg.id}:${pkg.name}:${pkg.package_prices.map((p) => p.vehicle_type_id).join(",")}`}
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
            <div>
              <h2 className="font-heading text-2xl">3. Optional extras</h2>
              <p className="text-sm text-muted-foreground">
                Add-ons shown with a package page and in the booking form. Each extra belongs to one
                package, or to any package.
              </p>
            </div>
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

          <section className="space-y-4">
            <div>
              <h2 className="font-heading text-2xl">Vehicle types</h2>
              <p className="text-sm text-muted-foreground">
                These are the columns of the price list (Hatchback, Saloon, SUV). Rename or hide
                them here; you rarely need to change this.
              </p>
            </div>
            <VehicleTypesEditor
              key={JSON.stringify(data.data.vehicleTypes)}
              vehicleTypes={data.data.vehicleTypes}
            />
          </section>
        </>
      )}
    </div>
  );
}
