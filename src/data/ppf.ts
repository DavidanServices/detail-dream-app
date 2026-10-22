export type PpfFinish = "gloss" | "satin" | "matte";

/** One package by vehicle size. A null price means "price on request". */
export type PpfTier = { vehicleTypeId: string; title: string; blurb: string; price: number | null };

export type PpfColor = { id: string; name: string; hex: string; finish: PpfFinish };

export type PpfSettings = {
  name: string;
  description: string;
  tagline: string;
  features: string[];
  tiers: PpfTier[];
  colors: PpfColor[];
};

export const finishLabels: Record<PpfFinish, string> = {
  gloss: "Gloss",
  satin: "Satin",
  matte: "Matte",
};

// Defaults: they seed the database and are the fallback if Supabase is unreachable.
// Sizes and colours are edited in /admin > PPF. There are no prices until they are entered there.
export const ppfSettings: PpfSettings = {
  name: "Paint Protection Film",
  description: "Invisible, self-healing armor for high-impact areas.",
  tagline: "Self-healing protection for your paintwork",
  features: [
    "Self-healing technology",
    "UV stable",
    "Prevents rock chips",
    "Preserves resale value",
    "Custom coverage options",
  ],
  tiers: [
    {
      vehicleTypeId: "hatchback",
      title: "Small car",
      blurb: "Hatchbacks and compact cars",
      price: null,
    },
    {
      vehicleTypeId: "saloon",
      title: "Medium car",
      blurb: "Saloons, sedans and coupes",
      price: null,
    },
    {
      vehicleTypeId: "suv",
      title: "Large car",
      blurb: "SUVs, 4x4s and large vehicles",
      price: null,
    },
  ],
  colors: [
    { id: "gloss-black", name: "Gloss Black", hex: "#0b0b0d", finish: "gloss" },
    { id: "midnight-blue", name: "Midnight Blue", hex: "#14233f", finish: "gloss" },
    { id: "racing-red", name: "Racing Red", hex: "#b3121b", finish: "gloss" },
    { id: "british-green", name: "British Green", hex: "#0f3b2a", finish: "gloss" },
    { id: "arctic-white", name: "Arctic White", hex: "#f2f3f5", finish: "gloss" },
    { id: "nardo-grey", name: "Nardo Grey", hex: "#7c7f84", finish: "gloss" },
    { id: "satin-black", name: "Satin Black", hex: "#1a1a1c", finish: "satin" },
    { id: "satin-graphite", name: "Satin Graphite", hex: "#3b3e43", finish: "satin" },
    { id: "satin-silver", name: "Satin Silver", hex: "#a9adb3", finish: "satin" },
    { id: "matte-black", name: "Matte Black", hex: "#101012", finish: "matte" },
    { id: "matte-army-green", name: "Matte Army Green", hex: "#4b5238", finish: "matte" },
    { id: "matte-sand", name: "Matte Sand", hex: "#b9a789", finish: "matte" },
  ],
};

/** Lowest entered price across the sizes, or null while every size is "price on request". */
export const ppfFromPrice = (ppf: PpfSettings): number | null => {
  const prices = ppf.tiers.map((t) => t.price).filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};
