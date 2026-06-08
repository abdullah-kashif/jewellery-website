"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import type { Product } from "@/lib/site-data";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function WishlistClient() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fbf7ef] text-4xl text-[#a77a25]">
          ♥
        </div>

        <h2 className="mt-6 text-3xl font-semibold text-neutral-950">
          Your wishlist is empty
        </h2>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">
          Save your favourite jewellery, gemstones, and custom pieces here for
          later.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
        >
          Browse Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-5 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold text-neutral-950">
          Wishlist Items
        </h2>

        <button
          type="button"
          onClick={clearWishlist}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="space-y-5">
        {wishlistItems.map((item) => {
          const itemPrice = item.price || item.estimatedPriceFrom || 0;
          const quoteHref = `/custom-order?product=${item.slug}`;

          return (
            <div
              key={item.slug}
              className="grid gap-5 rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-4 md:grid-cols-[120px_1fr_auto]"
            >
              <Link
                href={`/product/${item.slug}`}
                className="flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#d6b46a] text-3xl"
              >
                ◆
              </Link>

              <div>
                <p className="text-xs tracking-[0.18em] text-[#a77a25] uppercase">
                  {item.category.replace("-", " ")}
                </p>

                <Link href={`/product/${item.slug}`}>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-950 hover:text-[#a77a25]">
                    {item.name}
                  </h3>
                </Link>

                <p className="mt-2 text-sm text-neutral-600">
                  {item.quoteRequired
                    ? `Estimated from ${formatPrice(itemPrice)}`
                    : formatPrice(itemPrice)}
                </p>

                <p className="mt-2 text-sm text-neutral-500">
                  Status: {item.stockStatus}
                </p>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.slug)}
                  className="mt-4 text-sm font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-col justify-center gap-3 md:min-w-[210px]">
                {item.quoteRequired ||
                item.productType === "custom-quote" ||
                item.productType === "made-to-order" ? (
                  <Link
                    href={quoteHref}
                    className="rounded-full bg-neutral-950 px-6 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
                  >
                    Request Quote
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(item as Product)}
                    className="rounded-full bg-neutral-950 px-6 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
                  >
                    Add To Cart
                  </button>
                )}

                <Link
                  href={`/product/${item.slug}`}
                  className="rounded-full border border-[#d6b46a] px-6 py-3 text-center text-xs font-semibold tracking-[0.16em] text-[#a77a25] uppercase transition hover:bg-[#d6b46a] hover:text-neutral-950"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="rounded-full border border-[#d6b46a] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase transition hover:bg-[#d6b46a] hover:text-neutral-950"
        >
          Continue Shopping
        </Link>

        <Link
          href="/cart"
          className="rounded-full bg-[#a77a25] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-neutral-950"
        >
          Go To Cart
        </Link>
      </div>
    </div>
  );
}