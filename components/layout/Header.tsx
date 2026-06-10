"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type StoredItem = {
  id?: string;
  slug?: string;
  quantity?: number;
  qty?: number;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/custom-jewellery", label: "Custom Jewellery" },
  { href: "/gemstones", label: "Gemstones" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
  { href: "/track-order", label: "Track Order" },
];

function getStoredCount(keys: string[]) {
  if (typeof window === "undefined") {
    return 0;
  }

  for (const key of keys) {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (Array.isArray(parsedValue)) {
        return parsedValue.reduce((total: number, item: unknown) => {
          const currentItem = item as StoredItem;
          const itemQuantity = Number(
            currentItem.quantity ?? currentItem.qty ?? 1
          );

          return total + (Number.isFinite(itemQuantity) ? itemQuantity : 1);
        }, 0);
      }

      if (parsedValue && typeof parsedValue === "object") {
        const values = Object.values(parsedValue as Record<string, unknown>);

        return values.reduce((total: number, item: unknown) => {
          const currentItem = item as StoredItem;
          const itemQuantity = Number(
            currentItem.quantity ?? currentItem.qty ?? 1
          );

          return total + (Number.isFinite(itemQuantity) ? itemQuantity : 1);
        }, 0);
      }
    } catch {
      return 0;
    }
  }

  return 0;
}

export function Header() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith("/admin");

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    function updateCounts() {
      setCartCount(
        getStoredCount(["luxora_cart", "luxora-cart", "cart", "cartItems"])
      );
      setWishlistCount(
        getStoredCount([
          "luxora_wishlist",
          "luxora-wishlist",
          "wishlist",
          "wishlistItems",
        ])
      );
    }

    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("luxora-cart-updated", updateCounts);
    window.addEventListener("luxora-wishlist-updated", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("luxora-cart-updated", updateCounts);
      window.removeEventListener("luxora-wishlist-updated", updateCounts);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isMobileMenuOpen]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <header
      className={`site-header${isMobileMenuOpen ? " site-header--menu-open" : ""}`}
    >
      <div className="site-header__inner">
        <Link href="/" className="site-brand" aria-label="LUXORA home">
          <span className="site-brand__name">LUXORA</span>
          <span className="site-brand__tagline">Fine Jewellery</span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav__link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-actions">
          <Link
            href="/account"
            className="site-action-link site-action-link--text"
          >
            Account
          </Link>

          <Link
            href="/wishlist"
            className="site-action-link site-action-link--text site-action-link--wishlist"
          >
            Wishlist
            <span className="luxora-count-badge">
              {wishlistCount}
            </span>
          </Link>

          <Link
            href="/cart"
            className="site-action-link site-action-link--cart luxora-cart-link"
          >
            Cart
            <span className="luxora-cart-count luxora-count-badge">
              {cartCount}
            </span>
          </Link>

          <button
            type="button"
            className="site-menu-button"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mobile-nav-backdrop"
        aria-label="Close mobile menu"
        onClick={closeMobileMenu}
      />

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav__header">
          <div>
            <p className="mobile-nav__brand">LUXORA</p>
            <p className="mobile-nav__tagline">Fine Jewellery</p>
          </div>

          <button
            type="button"
            className="mobile-nav__close"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            X
          </button>
        </div>

        <div className="mobile-nav__links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav__link"
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mobile-nav__actions">
          <Link
            href="/account"
            className="luxora-btn luxora-btn-outline"
            onClick={closeMobileMenu}
          >
            Account
          </Link>
          <Link
            href="/wishlist"
            className="luxora-btn luxora-btn-outline"
            onClick={closeMobileMenu}
          >
            Wishlist <span className="luxora-count-badge">{wishlistCount}</span>
          </Link>
          <Link
            href="/cart"
            className="luxora-btn luxora-btn-dark"
            onClick={closeMobileMenu}
          >
            Cart <span className="luxora-count-badge">{cartCount}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
