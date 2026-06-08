import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/lib/site-data";

type SupabaseProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  product_type: string;
  price: number | null;
  estimated_price_from: number | null;
  quote_required: boolean;
  metal_type: string | null;
  gold_karat: string | null;
  gold_weight: string | null;
  stone_type: string | null;
  stone_weight: string | null;
  diamond_carat: string | null;
  diamond_cut: string | null;
  diamond_color: string | null;
  diamond_clarity: string | null;
  gemstone_carat: string | null;
  gemstone_shape: string | null;
  gemstone_origin: string | null;
  gemstone_treatment: string | null;
  certificate: string | null;
  stock_status: string;
  short_description: string;
  description: string;
  delivery_time: string;
  return_eligible: boolean;
  created_at: string;
  updated_at: string | null;
};

function mapProduct(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    productType: row.product_type,
    price: row.price || undefined,
    estimatedPriceFrom: row.estimated_price_from || undefined,
    quoteRequired: row.quote_required,
    metalType: row.metal_type || undefined,
    goldKarat: row.gold_karat || undefined,
    goldWeight: row.gold_weight || undefined,
    stoneType: row.stone_type || undefined,
    stoneWeight: row.stone_weight || undefined,
    diamondCarat: row.diamond_carat || undefined,
    diamondCut: row.diamond_cut || undefined,
    diamondColor: row.diamond_color || undefined,
    diamondClarity: row.diamond_clarity || undefined,
    gemstoneCarat: row.gemstone_carat || undefined,
    gemstoneShape: row.gemstone_shape || undefined,
    gemstoneOrigin: row.gemstone_origin || undefined,
    gemstoneTreatment: row.gemstone_treatment || undefined,
    certificate: row.certificate || undefined,
    stockStatus: row.stock_status,
    shortDescription: row.short_description,
    description: row.description,
    deliveryTime: row.delivery_time,
    returnEligible: row.return_eligible,
  } as Product;
}

export async function getProductsFromDb() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }

  return ((data || []) as SupabaseProductRow[]).map(mapProduct);
}

export async function getGemstonesFromDb() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("product_type", "gemstone")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load gemstones:", error.message);
    return [];
  }

  return ((data || []) as SupabaseProductRow[]).map(mapProduct);
}

export async function getProductBySlugFromDb(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapProduct(data as SupabaseProductRow);
}

export async function getRelatedProductsFromDb(
  currentSlug: string,
  category: string
) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("slug", currentSlug)
    .limit(3);

  if (error) {
    console.error("Failed to load related products:", error.message);
    return [];
  }

  return ((data || []) as SupabaseProductRow[]).map(mapProduct);
}