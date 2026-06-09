import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseUserSafely } from "@/lib/supabase/auth";

export type CustomerProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function getCurrentCustomer() {
  const supabase = await createSupabaseServerClient();
  const user = await getSupabaseUserSafely(supabase);

  if (!user) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data: profile, error } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load customer profile:", error.message);
  }

  return {
    user,
    profile: profile as CustomerProfile | null,
  };
}
