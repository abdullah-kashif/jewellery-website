import Link from "next/link";
import { FAQAccordion, type FAQItem } from "@/components/faq/FAQAccordion";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

const faqItems: FAQItem[] = [
  {
    category: "General",
    question: "What does LUXORA sell?",
    answer:
      "LUXORA sells ready-made jewellery, custom jewellery, diamonds, and gemstones. Ready-made items can be purchased directly, while custom pieces require a quotation.",
  },
  {
    category: "Custom Jewellery",
    question: "How does custom jewellery ordering work?",
    answer:
      "You submit your design idea through the custom order form. Our team reviews your metal, stone, size, budget, and design details. Then we send a quotation. Production starts after you approve the quote and pay the deposit.",
  },
  {
    category: "Pricing",
    question: "Why do custom jewellery products not have fixed final prices?",
    answer:
      "Custom jewellery pricing depends on gold rate, gold weight, diamond or gemstone selection, making charges, size, and design complexity. Because market rates can change, we provide a quote before production.",
  },
  {
    category: "Pricing",
    question: "What does estimated price from mean?",
    answer:
      "Estimated price from means the product may start near that range, but the final price can change depending on gold weight, gemstone quality, diamond grade, design size, and current market rates.",
  },
  {
    category: "Deposit",
    question: "Do I need to pay a deposit for custom jewellery?",
    answer:
      "Yes. Custom jewellery usually starts after quotation approval and deposit payment. The remaining balance is paid before shipping or final delivery.",
  },
  {
    category: "Gold",
    question: "Which gold karat options are available?",
    answer:
      "Common options include 10K, 14K, 18K, 21K, and 22K depending on the jewellery type and design requirement. Availability can vary by product and country.",
  },
  {
    category: "Gemstones",
    question: "Are gemstones certified?",
    answer:
      "Selected gemstones and diamonds can be provided with certificates or authenticity details. Certification availability depends on the specific stone.",
  },
  {
    category: "Gemstones",
    question: "Can I request a gemstone that is not listed?",
    answer:
      "Yes. You can submit a custom order or contact request with your required gemstone, size, shape, color, origin preference, and budget.",
  },
  {
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "After checkout, you receive an order number. Go to the Track Order page and enter your order number to view status and order details.",
  },
  {
    category: "Payment",
    question: "Which payment methods are supported?",
    answer:
      "Currently the site supports manual invoice, bank transfer, and payment gateway placeholder flow. Real payment gateway integration will be added later.",
  },
  {
    category: "Payment",
    question: "What is the best payment method for worldwide customers?",
    answer:
      "For high-value jewellery and international orders, manual invoice or bank transfer is often safer because shipping, insurance, and customs may need confirmation before final payment.",
  },
  {
    category: "Shipping",
    question: "Do you ship worldwide?",
    answer:
      "Yes, the website is designed for worldwide customers. Final shipping cost, insurance, delivery time, and customs duties may depend on destination country.",
  },
  {
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Ready-made products may take around 7 to 18 business days depending on item and destination. Custom jewellery can take 2 to 8 weeks after deposit depending on complexity.",
  },
  {
    category: "Returns",
    question: "Can I return ready-made jewellery?",
    answer:
      "Ready-made jewellery may be return eligible if unused, undamaged, and returned according to policy conditions. Final eligibility depends on the product and return policy.",
  },
  {
    category: "Returns",
    question: "Can custom jewellery be returned?",
    answer:
      "Custom and made-to-order jewellery is usually non-refundable once production starts because it is made specifically for the customer.",
  },
];

const categories = [
  "General",
  "Custom Jewellery",
  "Pricing",
  "Deposit",
  "Gold",
  "Gemstones",
  "Orders",
  "Payment",
  "Shipping",
  "Returns",
];

export const metadata = {
  title: "FAQs | LUXORA Jewellery",
  description:
    "Frequently asked questions about LUXORA jewellery, custom orders, pricing, gemstones, shipping, payments, and returns.",
};

export default function FAQPage() {
  return (
    <main className="bg-[#fbf7ef]">
      <PageIntroHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Find answers about ready-made jewellery, custom orders, gemstones, pricing, payment, shipping, and returns."
        imageSrc="/images/home/hero-jewellery.jpg"
        imageAlt="Fine jewellery collection for customer support questions"
        theme="dark"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-neutral-950 uppercase">
            FAQ Categories
          </h2>

          <div className="mt-5 flex flex-col gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href="#faqs"
                className="rounded-full bg-[#fbf7ef] px-4 py-2 text-sm text-neutral-700 transition hover:bg-[#eadfca] hover:text-neutral-950"
              >
                {category}
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-950 p-5 text-white">
            <h3 className="font-semibold">Still need help?</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              Contact our team for custom jewellery, payment, shipping, or order
              support.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-block rounded-full bg-[#d6b46a] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-neutral-950 uppercase hover:bg-white"
            >
              Contact Us
            </Link>
          </div>
        </aside>

        <div id="faqs">
          <div className="mb-6 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Answers
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
              Common Questions
            </h2>
            <p className="mt-3 leading-7 text-neutral-600">
              These FAQs explain the main workflow of the LUXORA ecommerce
              website.
            </p>
          </div>

          <FAQAccordion items={faqItems} />
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Custom Quote
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Need custom jewellery? Submit a request with design, stone, metal,
              budget, and size.
            </p>
            <Link
              href="/custom-order"
              className="mt-5 inline-block text-sm font-semibold text-[#a77a25] hover:underline"
            >
              Start Custom Order →
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Track Order
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Already placed an order? Use your order number to track the latest
              status.
            </p>
            <Link
              href="/track-order"
              className="mt-5 inline-block text-sm font-semibold text-[#a77a25] hover:underline"
            >
              Track Order →
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-[#fbf7ef] p-7">
            <h3 className="text-xl font-semibold text-neutral-950">
              Contact Support
            </h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Contact our team for payment, shipping, gemstone, or order
              questions.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-block text-sm font-semibold text-[#a77a25] hover:underline"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
