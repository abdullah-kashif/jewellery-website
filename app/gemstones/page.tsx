import Link from "next/link";
import { GemstoneCard } from "@/components/gemstone/GemstoneCard";
import { getGemstonesFromDb } from "@/lib/products-db";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gemstones | LUXORA Jewellery",
  description:
    "Explore diamonds, rubies, emeralds, sapphires, and gemstones available by quotation.",
};

export default async function GemstonesPage() {
  const gemstones = await getGemstonesFromDb();

  return (
    <main className="bg-[#fbf7ef]">
      <section className="bg-neutral-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
            Gemstones
          </p>

          <h1 className="mt-4 text-5xl font-semibold md:text-6xl">
            Diamonds & Gemstones
          </h1>

          <p className="mt-5 max-w-3xl leading-8 text-neutral-300">
            Browse gemstones loaded from Supabase. Availability and final price
            depend on market rate, certificate, carat, origin, and treatment.
          </p>

          <Link
            href="/custom-order"
            className="mt-8 inline-block rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-white"
          >
            Ask For Stone Sourcing
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-neutral-950">
            Available By Quote
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
            Showing {gemstones.length} gemstone records from Supabase.
          </p>
        </div>

        {gemstones.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {gemstones.map((gemstone) => (
              <GemstoneCard key={gemstone.id} gemstone={gemstone} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
            <h2 className="text-3xl font-semibold text-neutral-950">
              No gemstones found
            </h2>
            <p className="mt-3 text-neutral-600">
              Run the seed route first: /api/admin/seed-products
            </p>
          </div>
        )}
      </section>
    </main>
  );
}