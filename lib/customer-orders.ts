import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type CustomerOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
};

export type CustomerOrder = {
  id: string;
  reference: string;
  customer_user_id: string | null;
  customer_name: string;
  customer_email: string;
  whatsapp: string | null;
  country: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  order_items: CustomerOrderItem[];
};

export async function getCurrentCustomerOrders() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load customer orders:", error.message);
    return [];
  }

  return (data || []) as CustomerOrder[];
}