import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "18K / 22K", label: "Gold Options" },
  { value: "Worldwide", label: "Shipping Support" },
  { value: "Custom", label: "Jewellery Design" },
  { value: "Certified", label: "Gemstones Available" },
];

const values = [
  {
    title: "Luxury Craftsmanship",
    text: "Every piece is designed with attention to detail, finishing, comfort, and long-term beauty.",
  },
  {
    title: "Transparent Quotation",
    text: "Custom jewellery prices are quoted clearly because gold, diamond, and gemstone rates can change.",
  },
  {
    title: "Certified Stones",
    text: "Selected diamonds and gemstones can be provided with certificate or authenticity details.",
  },
  {
    title: "Worldwide Customers",
    text: "We support jewellery customers from different countries with shipping and order guidance.",
  },
];

const timeline = [
  {
    title: "Design Consultation",
    text: "We understand your jewellery idea, budget, metal choice, stone preference, and delivery country.",
  },
  {
    title: "Material Selection",
    text: "Gold karat, gemstone, diamond quality, and making requirements are reviewed before quotation.",
  },
  {
    title: "Crafting & Finishing",
    text: "After deposit confirmation, your jewellery is crafted, polished, checked, and prepared for delivery.",
  },
  {
    title: "Shipping & Support",
    text: "Your order is packed securely and shipped with tracking where available.",
  },
];

export const metadata = {
  title: "About Us | LUXORA Jewellery",
  description:
    "Learn about LUXORA, a luxury jewellery brand for custom jewellery, ready-made jewellery, diamonds, and certified gemstones.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="relative overflow-hidden bg-neutral-950 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8a651d55,transparent_35%),linear-gradient(120deg,#0a0a0a,#1f1a12)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              About LUXORA
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-7xl">
              Fine Jewellery Made With Trust
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
              LUXORA is a luxury jewellery ecommerce brand focused on
              ready-made jewellery, custom designs, diamonds, and certified
              gemstones for worldwide customers.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#d6b46a] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase transition hover:bg-white"
              >
                Shop Collection
              </Link>

              <Link
                href="/custom-order"
                className="rounded-full border border-white/30 px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
              >
                Start Custom Order
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#f7ead0] via-white to-[#caa24d]">
              <Image
                src="/images/home/hero-jewellery.jpg"
                alt="LUXORA fine jewellery collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eadfca] bg-white px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-6 text-center"
            >
              <p className="text-3xl font-semibold text-neutral-950">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Our Story
            </p>

            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              Designed For Special Moments
            </h2>

            <p className="mt-6 leading-8 text-neutral-700">
              Jewellery is personal. It can represent love, family, achievement,
              culture, celebration, and memory. LUXORA was created to give
              customers a premium way to buy ready-made jewellery and request
              custom pieces with a clear quotation process.
            </p>

            <p className="mt-5 leading-8 text-neutral-700">
              Since gold, diamond, and gemstone rates can move up and down, our
              custom jewellery process is based on quotation instead of forcing
              one fixed final price. This keeps the buying process fair,
              transparent, and flexible for worldwide customers.
            </p>
          </div>

          <div className="rounded-[2rem] bg-neutral-950 p-8 text-white">
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              What We Offer
            </p>

            <div className="mt-8 grid gap-4">
              {[
                "Ready-made jewellery collection",
                "Custom jewellery quotation",
                "Diamond and gemstone sourcing",
                "Gold karat and metal options",
                "Deposit-based custom order workflow",
                "Worldwide shipping guidance",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Our Values
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              Built On Quality And Clarity
            </h2>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-7 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#a77a25]">
                  ◆
                </div>
                <h3 className="mt-5 text-xl font-semibold text-neutral-950">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2eadc] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
            <div>
              <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
                Craft Process
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
                From Idea To Jewellery
              </h2>
              <p className="mt-5 leading-8 text-neutral-700">
                Our custom workflow helps customers understand each stage before
                production starts.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {timeline.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-[#eadfca] bg-white p-7 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a77a25] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-neutral-950 p-10 text-center text-white">
          <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
            Start With LUXORA
          </p>
          <h2 className="mt-4 text-4xl font-semibold">
            Ready to find or create your jewellery?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-300">
            Browse our collection or send a custom request and our team will
            guide you through the quotation and order process.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-white"
            >
              Shop Now
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:border-[#d6b46a] hover:text-[#d6b46a]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
