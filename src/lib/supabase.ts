import { createClient } from "@supabase/supabase-js";

// Davidan's Supabase project. The URL and the publishable key are public by design (they ship in the
// browser of every visitor); what protects the data is row level security in the database, never
// hiding these two values. They are the fallback so the site works even when the hosting build has
// no VITE_SUPABASE_* variables. Set the variables to point at another project, or set
// VITE_SUPABASE_URL=off to run the site without a database (defaults only).
const DEFAULT_URL = "https://eohbgtkezqukhqjoplip.supabase.co";
const DEFAULT_PUBLISHABLE_KEY = "sb_publishable_0XEcOZigd1x3okUuYM2z-g_VW5qJwPD";

const envUrl = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined)?.trim();
const envKey = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined)?.trim();

const disabled = envUrl === "off";
const url = disabled ? undefined : envUrl || DEFAULT_URL;
const key = disabled ? undefined : envKey || DEFAULT_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured
  ? createClient(url as string, key as string, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
      },
    })
  : null;
