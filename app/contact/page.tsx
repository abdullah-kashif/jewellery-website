import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";

type ContactPageProps = {
  searchParams?: Promise<{
    product?: string;
    order?: string;
  }>;
};

const contactCards = [
  {
    title: "Email",
    value: "info@luxora.com",
    text: "For general questions, custom quotes, and support.",
  },
  {
    title: "WhatsApp",
    value: "+92 XXXXXXXXXX",
    text: "Fast support for custom jewellery and urgent orders.",
  },
  {
    title: "Phone",
    value: "+92 XXXXXXXXXX",
    text: "Available during business working hours.",
  },
  {
    title: "Worldwide",
    value: "International Support",
    text: "We support customers from UAE, UK, USA, Europe, and worldwide.",
  },
];

export const metadata = {
  title: "Contact Us | LUXORA Jewellery",
  description:
    "Contact LUXORA for jewellery questions, custom orders, gemstones, shipping, and support.",
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
            Home / Contact
          </p>

          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold text-neutral-950 md:text-5xl">
                Get In Touch
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
                Contact us for custom jewellery, gemstones, product questions,
                order support, payment guidance, and worldwide shipping.
              </p>
            </div>

            <Link
              href="/custom-order"
              className="rounded-full bg-neutral-950 px-7 py-3 text-center text-xs font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#a77a25]"
            >
              Start Custom Order
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-neutral-950 p-7 text-white shadow-sm">
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              Support
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              We are here to help
            </h2>

            <p className="mt-4 leading-7 text-neutral-300">
              Send us your question and our jewellery team will guide you about
              products, custom designs, gemstone availability, and order process.
            </p>
          </div>

          {contactCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                {card.title}
              </p>

              <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                {card.value}
              </h3>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {card.text}
              </p>
            </div>
          ))}

          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
              Visit / Map
            </p>

            <div className="mt-4 flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbf7ef] to-[#d6b46a] text-center text-neutral-950">
              <div>
                <p className="text-4xl">⌖</p>
                <p className="mt-3 text-sm font-semibold">
                  Map Placeholder
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  Replace with Google Map later
                </p>
              </div>
            </div>
          </div>
        </aside>

        <ContactForm
          initialProduct={params.product || ""}
          initialOrder={params.order || ""}
        />
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Custom Jewellery Help
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              For custom jewellery, share your design idea, metal type, stone
              preference, size, budget, and delivery country.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Order Support
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              For existing orders, include your order number so our team can
              check payment, production, or shipping status.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Worldwide Customers
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              International customers can ask about shipping, customs, insurance,
              manual invoice, and payment options.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}