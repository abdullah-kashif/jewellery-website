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
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <h2 className="site-footer__brand">LUXORA</h2>
          <p className="site-footer__text">
            Custom fine jewellery, certified gemstones, and luxury pieces
            crafted for worldwide customers.
          </p>
        </div>

        <div>
          <h3 className="site-footer__title">Shop</h3>
          <div className="site-footer__links">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-footer__link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="site-footer__title">Policies</h3>
          <div className="site-footer__links">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-footer__link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="site-footer__title">Contact</h3>
          <div className="site-footer__contact">
            <p>Email: info@luxora.com</p>
            <p>WhatsApp: +92 314 2024447</p>
            <p>Worldwide Shipping Available</p>
            <Link href="/contact" className="site-footer__button">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        &copy; {new Date().getFullYear()} LUXORA. All rights reserved.
      </div>
    </footer>
  );
}
