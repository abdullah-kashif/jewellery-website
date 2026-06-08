import Link from "next/link";

type PolicySection = {
  title: string;
  points: string[];
};

type PolicyPageProps = {
  label: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
};

export function PolicyPage({
  label,
  title,
  description,
  lastUpdated,
  sections,
}: PolicyPageProps) {
  return (
    <main className="bg-[#fbf7ef]">
      <section className="relative overflow-hidden bg-neutral-950 px-4 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8a651d55,transparent_35%),linear-gradient(120deg,#0a0a0a,#1f1a12)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
            {label}
          </p>

          <h1 className="mt-4 text-5xl font-semibold md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl leading-8 text-neutral-300">
            {description}
          </p>

          <p className="mt-6 text-sm text-neutral-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-neutral-950 uppercase">
            Policy Pages
          </h2>

          <div className="mt-5 flex flex-col gap-2">
            {[
              { label: "Shipping Policy", href: "/shipping-policy" },
              { label: "Return Policy", href: "/return-policy" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-[#fbf7ef] px-4 py-2 text-sm text-neutral-700 transition hover:bg-[#eadfca] hover:text-neutral-950"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-950 p-5 text-white">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              Contact our team for order, shipping, payment, or custom jewellery
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

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
            <p className="leading-8 text-neutral-700">
              This page explains the basic policy for LUXORA customers. For
              custom jewellery, final terms may depend on the approved quote,
              invoice, destination country, and order type.
            </p>
          </div>

          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="text-2xl font-semibold text-neutral-950">
                {section.title}
              </h2>

              <div className="mt-5 space-y-4">
                {section.points.map((point) => (
                  <div key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#a77a25]" />
                    <p className="leading-7 text-neutral-700">{point}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-[2rem] bg-neutral-950 p-8 text-center text-white">
            <h2 className="text-2xl font-semibold">
              Still have a question?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-neutral-300">
              Contact us before placing an order if you need clarification about
              shipping, returns, refunds, custom orders, or payment.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-white"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}