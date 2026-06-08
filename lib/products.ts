import { supabaseAdmin } from "@/lib/supabase/admin";

export type Product = {
  id: string;
  name: string;
  slug: string;
  product_type?: string | null;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  metal?: string | null;
  stone?: string | null;
  carat?: string | null;
  clarity?: string | null;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  stock_quantity?: number | null;
  stock_status?: string | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
  is_custom?: boolean | null;
  image_url?: string | null;
  gallery_urls?: string[] | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }

  return (data || []) as Product[];
}

export async function getFeaturedProducts() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("getFeaturedProducts error:", error.message);
    return [];
  }

  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error:", error.message);
    return null;
  }

  return data as Product | null;
}

export function formatProductPrice(price?: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}