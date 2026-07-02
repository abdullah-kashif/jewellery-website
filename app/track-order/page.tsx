import { TrackOrderClient } from "@/components/track-order/TrackOrderClient";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track Order | LUXORA Jewellery",
  description: "Track your LUXORA jewellery order status.",
};

export default function TrackOrderPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <PageIntroHero
        eyebrow="Order Tracking"
        title="Track Your Order"
        description="Check your jewellery order status, payment progress, and shipping updates using your order reference."
        imageSrc="/images/home/product-gold-tennis-bracelet.jpg"
        imageAlt="Packed fine jewellery order ready for tracking"
        theme="dark"
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <TrackOrderClient />
      </section>
    </main>
  );
}
