import Link from "next/link";
import { ShopClient, type ShopProduct } from "@/components/shop/ShopClient";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Jewellery | LUXORA Jewellery",
  description:
    "Browse luxury jewellery, gemstones, rings, pendants, bracelets, and custom jewellery designs.",
};

type ShopPageProps = {
  searchParams?: Promise<{
    category?: string;
    sort?: string;
  }>;
};

async function getProducts(): Promise<ShopProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Shop products fetch error:", error.message);
    return [];
  }

  return (data || []) as ShopProduct[];
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const products = await getProducts();

  return (
    <main>
      <section className="border-b border-[#eadfca] bg-white px-4 py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm tracking-[0.32em] text-[#a77a25] uppercase">
              Home / Shop
            </p>

            <h1 className="mt-5 text-5xl font-semibold text-neutral-950 md:text-6xl">
              Our Jewellery Collection
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">
              Browse ready-made jewellery, made-to-order pieces, and luxury
              gemstone designs crafted for worldwide customers.
            </p>
          </div>

          <Link
            href="/custom-order"
            className="inline-flex w-fit items-center justify-center rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#a77a25]"
          >
            Start Custom Order
          </Link>
        </div>
      </section>

      <ShopClient
        products={products}
        initialCategory={params?.category || ""}
        initialSort={params?.sort || "newest"}
      />
    </main>
  );
}