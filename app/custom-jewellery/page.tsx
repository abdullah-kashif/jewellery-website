import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    title: "Share Your Idea",
    text: "Tell us your design, metal, stone, size, and budget.",
  },
  {
    title: "Get a Quote",
    text: "We calculate the quote based on current gold, diamond, and gemstone rates.",
  },
  {
    title: "Confirm & Pay Deposit",
    text: "Approve the quote and pay deposit to start production.",
  },
  {
    title: "Crafted For You",
    text: "Your jewellery is crafted, finished, packed, and shipped worldwide.",
  },
];

const customTypes = [
  {
    title: "Engagement Rings",
    href: "/custom-order?type=engagement-ring",
    text: "Create a unique ring with your chosen diamond, metal, and setting.",
  },
  {
    title: "Wedding Bands",
    href: "/custom-order?type=wedding-band",
    text: "Personalized bands in gold, platinum, or custom finish.",
  },
  {
    title: "Name Pendants",
    href: "/custom-order?type=name-pendant",
    text: "Custom name pendants in your selected font, size, and karat.",
  },
  {
    title: "Birthstone Jewellery",
    href: "/custom-order?type=birthstone-jewellery",
    text: "Create meaningful jewellery with birthstones and precious metals.",
  },
  {
    title: "Bridal Sets",
    href: "/custom-order?type=bridal-set",
    text: "Luxury bridal jewellery designed according to your event and budget.",
  },
  {
    title: "Redesign Old Jewellery",
    href: "/custom-order?type=redesign-old-jewellery",
    text: "Transform your old jewellery into a modern custom design.",
  },
];

const benefits = [
  "Made only for you",
  "Choose your gold karat",
  "Choose gemstone or diamond",
  "Personalized design",
  "Expert craftsmanship",
  "Worldwide delivery",
];

export default function CustomJewelleryPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="relative overflow-hidden bg-neutral-950 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8a651d55,transparent_35%),linear-gradient(120deg,#0a0a0a,#1f1a12)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              Custom Jewellery
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-7xl">
              Create Your Dream Jewellery
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
              Share your idea with us and our experts will craft a masterpiece
              based on your gold, gemstone, diamond, and budget preferences.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/custom-order"
                className="rounded-full bg-[#d6b46a] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase transition hover:bg-white"
              >
                Start Custom Order
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-white/30 px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
              >
                View Collection
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#f7ead0] via-white to-[#caa24d]">
              <Image
                src="/images/home/custom-jewellery-workbench.jpg"
                alt="Custom jewellery workbench for bespoke ring design"
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

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Process
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              How It Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-[#eadfca] bg-white p-7 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf7ef] text-lg font-semibold text-[#a77a25]">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
                Choose Your Style
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
                Custom Jewellery Types
              </h2>
            </div>

            <Link
              href="/custom-order"
              className="text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase hover:text-neutral-950"
            >
              Start Request →
            </Link>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {customTypes.map((type) => (
              <Link
                key={type.title}
                href={type.href}
                className="group rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#d6b46a] text-5xl text-neutral-950">
                  ◆
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-950 group-hover:text-[#a77a25]">
                  {type.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {type.text}
                </p>
                <p className="mt-5 text-sm font-semibold text-[#a77a25]">
                  Request Quote →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2eadc] px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-neutral-950 p-8 text-white">
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              Pricing
            </p>
            <h2 className="mt-4 text-4xl font-semibold">
              Why Custom Price Is Quoted
            </h2>
            <p className="mt-5 leading-8 text-neutral-300">
              Custom jewellery prices depend on gold weight, metal purity,
              gemstone or diamond selection, making charges, certification,
              and current market rates. That is why we confirm the final quote
              before production.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Gold weight",
                "Gold karat",
                "Diamond quality",
                "Gemstone type",
                "Making charges",
                "Shipping & insurance",
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

          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Deposit Workflow
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-neutral-950">
              Quote, Deposit, Production, Delivery
            </h2>

            <div className="mt-8 space-y-5">
              {[
                "Submit your custom request with design details.",
                "Our team reviews your design and sends final quotation.",
                "You approve the quote and pay deposit.",
                "Production starts after deposit confirmation.",
                "Remaining balance is paid before shipping.",
                "Jewellery is shipped with tracking and insurance where available.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a77a25] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="leading-7 text-neutral-700">{item}</p>
                </div>
              ))}
            </div>

            <Link
              href="/custom-order"
              className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
            >
              Start Custom Order
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              Made With Trust
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-6 text-center font-semibold text-neutral-800"
              >
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-[2rem] bg-neutral-950 p-10 text-center text-white">
            <h2 className="text-3xl font-semibold">
              Ready to create your jewellery?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-300">
              Submit your idea today and our team will contact you with a
              quotation based on your design and current market rates.
            </p>
            <Link
              href="/custom-order"
              className="mt-8 inline-block rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-white"
            >
              Start Your Custom Order
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
