import { Suspense } from "react";
import { CartClient } from "@/components/cart/CartClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cart | LUXORA Jewellery",
  description: "Review your LUXORA jewellery cart.",
};

export default function CartPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
            Home / Cart
          </p>

          <h1 className="mt-3 text-5xl font-semibold text-neutral-950">
            Shopping Cart
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            Review selected jewellery pieces before placing your order.
          </p>
        </div>
      </section>

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