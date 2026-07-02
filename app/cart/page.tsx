import { Suspense } from "react";
import { CartClient } from "@/components/cart/CartClient";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart | LUXORA Jewellery",
  description: "Review your LUXORA jewellery cart.",
};

export default function CartPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <PageIntroHero
        eyebrow="Home / Cart"
        title="Shopping Cart"
        description="Review selected jewellery pieces before placing your order."
        imageSrc="/images/home/product-diamond-solitaire-ring.jpg"
        imageAlt="Diamond ring selected for a jewellery cart"
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <Suspense
          fallback={
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 shadow-sm">
              Loading cart...
            </div>
          }
        >
          <CartClient />
        </Suspense>
      </section>
    </main>
  );
}
