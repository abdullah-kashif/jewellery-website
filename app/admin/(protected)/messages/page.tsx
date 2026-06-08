import Link from "next/link";
import { AdminMessagesClient } from "@/components/admin/AdminMessagesClient";

export const metadata = {
  title: "Admin Messages | LUXORA Jewellery",
};

export default function AdminMessagesPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <AdminHero
        title="Contact Messages"
        text="View local customer messages submitted from the contact page."
      />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <AdminMessagesClient />
      </section>
    </main>
  );
}

function AdminHero({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-neutral-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
          LUXORA Admin
        </p>
        <h1 className="mt-4 text-5xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-300">{text}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin" className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:border-[#d6b46a] hover:text-[#d6b46a]">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:border-[#d6b46a] hover:text-[#d6b46a]">
            Orders
          </Link>
          <Link href="/admin/quotes" className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase hover:border-[#d6b46a] hover:text-[#d6b46a]">
            Quotes
          </Link>
          <Link href="/admin/messages" className="rounded-full bg-[#d6b46a] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-neutral-950 uppercase">
            Messages
          </Link>
        </div>
      </div>
    </section>
  );
}