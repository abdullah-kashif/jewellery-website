import Link from "next/link";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

type CustomOrderPageProps = {
  searchParams?: Promise<{
    product?: string;
    type?: string;
    stone?: string;
  }>;
};

export const metadata = {
  title: "Start Custom Order | LUXORA Jewellery",
  description:
    "Submit your custom jewellery request and receive a quotation from LUXORA.",
};

export default async function CustomOrderPage({
  searchParams,
}: CustomOrderPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
            Home / Custom Order
          </p>

          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold text-neutral-950 md:text-5xl">
                Start Your Custom Order
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
                Fill out the form below and our team will contact you with a
                quote based on your design, gold, diamond, gemstone, and budget.
              </p>
            </div>

            <Link
              href="/custom-jewellery"
              className="rounded-full border border-[#d6b46a] px-7 py-3 text-center text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase hover:bg-[#d6b46a] hover:text-neutral-950"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <QuoteRequestForm
          initialProduct={params.product || ""}
          initialType={params.type || ""}
          initialStone={params.stone || ""}
        />

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-950">
              What Happens Next?
            </h2>

            <div className="mt-6 space-y-5">
              {[
                "We review your design request.",
                "We calculate gold, gemstone, diamond, and making charges.",
                "We send you a quotation.",
                "You approve and pay deposit.",
                "Production starts after confirmation.",
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbf7ef] text-sm font-semibold text-[#a77a25]">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-neutral-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-neutral-950 p-7 text-white">
            <h2 className="text-xl font-semibold">Need Fast Help?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              You can also contact us on WhatsApp for urgent custom jewellery
              requests.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[#d6b46a] px-6 py-3 text-xs font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-white"
            >
              Contact Us
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-950">
              Price Reminder
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Final price is not fixed until we confirm current gold, diamond,
              gemstone, and making charges. Quotes may be valid for a limited
              time because market rates can change.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}