import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | LUXORA Jewellery",
  description: "Place your LUXORA jewellery order.",
};

export default function CheckoutPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
            Home / Checkout
          </p>

          <h1 className="mt-3 text-5xl font-semibold text-neutral-950">
            Checkout
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            Enter your billing and shipping details to place your jewellery
            order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <CheckoutClient />
      </section>
    </main>
  );
}