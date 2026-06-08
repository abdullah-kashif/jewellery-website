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
    <header className="sticky top-0 z-50 border-b border-[#eadfca] bg-[#fbf7ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-5">
        <Link href="/" className="shrink-0">
          <div className="text-3xl font-semibold tracking-[0.28em] text-neutral-950">
            LUXORA
          </div>

          <div className="mt-1 text-xs tracking-[0.32em] text-[#a77a25] uppercase">
            Fine Jewellery
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs font-medium tracking-[0.18em] text-neutral-800 uppercase transition hover:text-[#a77a25]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[10px] font-medium tracking-[0.12em] text-neutral-800 uppercase transition hover:text-[#a77a25]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/account"
            className="whitespace-nowrap text-sm text-neutral-900 transition hover:text-[#a77a25]"
          >
            Account
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-1 whitespace-nowrap text-sm text-neutral-900 transition hover:text-[#a77a25]"
          >
            Wishlist
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6b46a] px-1.5 text-[11px] font-semibold text-neutral-950">
              {wishlistCount}
            </span>
          </Link>

          <Link
            href="/cart"
            className="luxora-cart-link inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-xs font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#a77a25]"
          >
            Cart
            <span className="luxora-cart-count inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6b46a] px-1.5 text-[11px] font-semibold text-neutral-950">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-[#eadfca] px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.16em] text-neutral-800 uppercase transition hover:text-[#a77a25]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
