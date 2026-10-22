import type { Package, VehicleTypeInfo } from "@/data/packages";

/** Card title for a vehicle type: the edited text, else "<Vehicle> <suffix>". */
export const tierTitle = (pkg: Package | undefined, v: VehicleTypeInfo, suffix: string) =>
  pkg?.tiers?.[v.id]?.title || `${v.label} ${suffix}`;

export const tierBlurb = (pkg: Package | undefined, v: VehicleTypeInfo) =>
  pkg?.tiers?.[v.id]?.blurb || undefined;
