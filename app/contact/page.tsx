import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

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
    value: "+92 314 2024447",
    text: "24/7 support for custom jewellery, orders, and urgent questions.",
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
      <PageIntroHero
        eyebrow="Home / Contact"
        title="Get In Touch"
        description="Contact us for custom jewellery, gemstones, product questions, order support, payment guidance, and worldwide shipping."
        imageSrc="/images/home/custom-jewellery-workbench.jpg"
        imageAlt="Jewellery workbench for customer design consultation"
        actions={[
          {
            href: "/custom-order",
            label: "Start Custom Order",
          },
        ]}
      />

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
