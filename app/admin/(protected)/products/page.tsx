import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const metadata = {
  title: "Admin Products | LUXORA Jewellery",
  description: "Manage LUXORA jewellery products.",
};

export default function AdminProductsPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.2em] text-[#a77a25] uppercase">
            Admin / Products
          </p>

          <h1 className="mt-4 text-5xl font-semibold text-neutral-950">
            Manage Products
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            Add, update, and delete jewellery products from Supabase.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <AdminProductsClient />
      </section>
    </main>
  );
}