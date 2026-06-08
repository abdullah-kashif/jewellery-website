import { TrackOrderClient } from "@/components/track-order/TrackOrderClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track Order | LUXORA Jewellery",
  description: "Track your LUXORA jewellery order status.",
};

export default function TrackOrderPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-neutral-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
            Order Tracking
          </p>

          <h1 className="mt-4 text-5xl font-semibold">Track Your Order</h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
            Check your jewellery order status, payment progress, and shipping
            updates using your order reference.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <TrackOrderClient />
      </section>
    </main>
  );
}