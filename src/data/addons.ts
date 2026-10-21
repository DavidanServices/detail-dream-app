export type Addon = { id: string; name: string; description: string; price: number };

export const LEATHER_CONDITIONING_ID = "leather-conditioning";

// Default optional extras. They seed the database and are the fallback if Supabase is unreachable.
export const addons: Addon[] = [
  {
    id: LEATHER_CONDITIONING_ID,
    name: "Leather Conditioning",
    description:
      "Nourishes and protects leather surfaces, helping restore softness and maintain a factory-fresh finish.",
    price: 30,
  },
];
