import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | LUXORA Jewellery",
  description: "Place your LUXORA jewellery order.",
};

export default function CheckoutPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <PageIntroHero
        eyebrow="Home / Checkout"
        title="Checkout"
        description="Enter your billing and shipping details to place your jewellery order."
        imageSrc="/images/home/product-pearl-drop-earrings.jpg"
        imageAlt="Pearl earrings prepared for checkout"
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <CheckoutClient />
      </section>
    </main>
  );
}
