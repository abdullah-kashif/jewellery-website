import { ShopClient, type ShopProduct } from "@/components/shop/ShopClient";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

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
      <PageIntroHero
        eyebrow="Home / Shop"
        title="Our Jewellery Collection"
        description="Browse ready-made jewellery, made-to-order pieces, and luxury gemstone designs crafted for worldwide customers."
        imageSrc="/images/home/hero-jewellery.jpg"
        imageAlt="Diamond rings, earrings, and fine jewellery collection"
        actions={[
          {
            href: "/custom-order",
            label: "Start Custom Order",
          },
        ]}
      />

      <ShopClient
        products={products}
        initialCategory={params?.category || ""}
        initialSort={params?.sort || "newest"}
      />
    </main>
  );
}
