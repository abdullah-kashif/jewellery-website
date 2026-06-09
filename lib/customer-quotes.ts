import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseUserSafely } from "@/lib/supabase/auth";

export type CustomerQuoteRequest = {
  id: string;
  reference: string | null;
  customer_user_id: string | null;
  customer_profile_id: string | null;
  full_name: string | null;
  email: string | null;
  whatsapp: string | null;
  country: string | null;

  customer_approved_at: string | null;
  customer_response: string | null;

  product: string | null;
  product_type: string | null;

  deposit_percentage: number | null;
deposit_amount: number | null;
deposit_order_id: string | null;
deposit_created_at: string | null;

  metal: string | null;
  metal_type: string | null;

  gold_karat: string | null;

  stone: string | null;
  stone_type: string | null;

  size: string | null;
  ring_size: string | null;

  budget: string | null;
  budget_range: string | null;

  message: string | null;
  additional_message: string | null;

  reference_image_name: string | null;
  image_url: string | null;

  status: string | null;
  quoted_price: number | null;
  admin_notes: string | null;

  created_at: string;
  updated_at: string | null;
};

export async function getCurrentCustomerQuoteRequests() {
  const supabase = await createSupabaseServerClient();
  const user = await getSupabaseUserSafely(supabase);

  if (!user) {
    return [];
  }

  const email = user.email || "";

  const { data, error } = await supabaseAdmin
    .from("quote_requests")
    .select("*")
    .or(`customer_user_id.eq.${user.id},email.eq.${email}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load customer quotes:", error.message);
    return [];
  }

  return (data || []) as CustomerQuoteRequest[];
}
