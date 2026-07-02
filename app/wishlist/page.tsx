import { WishlistClient } from "@/components/wishlist/WishlistClient";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wishlist | LUXORA Jewellery",
  description: "View your saved LUXORA jewellery items.",
};

export default function WishlistPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <PageIntroHero
        eyebrow="Wishlist"
        title="Saved Jewellery"
        description="Keep your favourite jewellery, gemstones, and custom ideas in one place before you order."
        imageSrc="/images/home/product-emerald-cut-ring.jpg"
        imageAlt="Emerald ring saved to a jewellery wishlist"
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <WishlistClient />
      </section>
    </main>
  );
}
