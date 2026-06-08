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

  const isAdminRoute = pathname?.startsWith("/admin");

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

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="site-header">
      <input
        id="mobile-nav-toggle"
        type="checkbox"
        className="mobile-nav-toggle"
        aria-label="Toggle mobile menu"
      />

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

          <label
            className="site-menu-button"
            htmlFor="mobile-nav-toggle"
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </label>
        </div>
      </div>

      <label
        className="mobile-nav-backdrop"
        htmlFor="mobile-nav-toggle"
        aria-label="Close mobile menu"
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

          <label
            className="mobile-nav__close"
            htmlFor="mobile-nav-toggle"
            aria-label="Close menu"
          >
            X
          </label>
        </div>

        <div className="mobile-nav__links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav__link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mobile-nav__actions">
          <Link href="/account" className="luxora-btn luxora-btn-outline">
            Account
          </Link>
          <Link href="/wishlist" className="luxora-btn luxora-btn-outline">
            Wishlist <span className="luxora-count-badge">{wishlistCount}</span>
          </Link>
          <Link href="/cart" className="luxora-btn luxora-btn-dark">
            Cart <span className="luxora-count-badge">{cartCount}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
