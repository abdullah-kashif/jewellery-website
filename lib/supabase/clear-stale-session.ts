import type { SupabaseClient } from "@supabase/supabase-js";

export async function clearStaleBrowserSession(supabase: SupabaseClient) {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // Stale or already-used refresh tokens should not block a fresh login.
  }
}
