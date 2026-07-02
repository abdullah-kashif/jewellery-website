import { GemstoneCard } from "@/components/gemstone/GemstoneCard";
import { getGemstonesFromDb } from "@/lib/products-db";
import { PageIntroHero } from "@/components/ui/PageIntroHero";
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
      <PageIntroHero
        eyebrow="Gemstones"
        title="Diamonds & Gemstones"
        description="Browse gemstones loaded from Supabase. Availability and final price depend on market rate, certificate, carat, origin, and treatment."
        imageSrc="/images/home/gemstone-diamond.jpg"
        imageAlt="Certified diamond gemstone for bespoke jewellery"
        theme="dark"
        actions={[
          {
            href: "/custom-order",
            label: "Ask For Stone Sourcing",
          },
        ]}
      />

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
