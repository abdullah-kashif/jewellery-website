import Link from "next/link";

const policyLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const shopLinks = [
  { label: "Shop Jewellery", href: "/shop" },
  { label: "Custom Jewellery", href: "/custom-jewellery" },
  { label: "Gemstones", href: "/gemstones" },
  { label: "Track Order", href: "/track-order" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#eadfca] bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[0.25em]">LUXORA</h2>
          <p className="mt-4 max-w-xs text-sm leading-7 text-neutral-300">
            Custom fine jewellery, certified gemstones, and luxury pieces
            crafted for worldwide customers.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] text-[#d6b46a] uppercase">
            Shop
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-neutral-300 hover:text-[#d6b46a]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] text-[#d6b46a] uppercase">
            Policies
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-neutral-300 hover:text-[#d6b46a]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] text-[#d6b46a] uppercase">
            Contact
          </h3>
          <div className="mt-5 space-y-3 text-sm text-neutral-300">
            <p>Email: info@luxora.com</p>
            <p>WhatsApp: +92XXXXXXXXXX</p>
            <p>Worldwide Shipping Available</p>
            <Link
              href="/contact"
              className="inline-block rounded-full border border-[#d6b46a] px-5 py-2 text-xs tracking-[0.18em] text-[#d6b46a] uppercase hover:bg-[#d6b46a] hover:text-neutral-950"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LUXORA. All rights reserved.
      </div>
    </footer>
  );
}