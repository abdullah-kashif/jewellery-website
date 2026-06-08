"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  price: number;
  quantity: number;
  image_url?: string | null;
};

const CART_STORAGE_KEY = "luxora_cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function readCartFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && item.id && item.slug && item.name)
      .map((item) => ({
        id: String(item.id),
        name: String(item.name),
        slug: String(item.slug),
        category: item.category ? String(item.category) : "Jewellery",
        price: Number(item.price || 0),
        quantity: Math.max(1, Number(item.quantity || 1)),
        image_url: item.image_url ? String(item.image_url) : null,
      }));
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

  window.setTimeout(() => {
    window.dispatchEvent(new Event("luxora-cart-updated"));
  }, 0);
}

export function CartClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addSlug = searchParams.get("add");

  const addProcessedRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCartItems(readCartFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    async function addProductFromUrl() {
      if (!mounted || !addSlug || addProcessedRef.current) {
        return;
      }

      addProcessedRef.current = true;
      setLoadingProduct(true);
      setError("");

      try {
        const response = await fetch(
          `/api/cart-product?slug=${encodeURIComponent(addSlug)}`
        );

        const data = await response.json();

        if (!response.ok || !data.ok || !data.product) {
          throw new Error(data.error || "Failed to add product to cart.");
        }

        const product = data.product;

        setCartItems((currentItems) => {
          const existingItem = currentItems.find(
            (item) => item.slug === product.slug
          );

          let nextItems: CartItem[];

          if (existingItem) {
            nextItems = currentItems.map((item) =>
              item.slug === product.slug
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            nextItems = [
              ...currentItems,
              {
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category || "Jewellery",
                price: Number(product.price || 0),
                quantity: 1,
                image_url: product.image_url || null,
              },
            ];
          }

          saveCartToStorage(nextItems);
          return nextItems;
        });

        router.replace("/cart");
      } catch (cartError) {
        setError(
          cartError instanceof Error
            ? cartError.message
            : "Failed to add product to cart."
        );
      } finally {
        setLoadingProduct(false);
      }
    }

    addProductFromUrl();
  }, [mounted, addSlug, router]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const shipping = cartItems.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  function updateQuantity(slug: string, quantity: number) {
    const nextQuantity = Math.max(1, quantity);

    setCartItems((currentItems) => {
      const nextItems = currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity: nextQuantity } : item
      );

      saveCartToStorage(nextItems);
      return nextItems;
    });
  }

  function removeItem(slug: string) {
    setCartItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.slug !== slug);

      saveCartToStorage(nextItems);
      return nextItems;
    });
  }

  function clearCart() {
    setCartItems([]);
    saveCartToStorage([]);
  }

  if (!mounted) {
    return (
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 shadow-sm">
        <p className="text-neutral-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-4xl font-semibold text-neutral-950">
              Your Cart
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-full border border-red-200 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-red-600 uppercase hover:bg-red-50"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loadingProduct && (
          <div className="mt-6 rounded-2xl border border-[#eadfca] bg-[#fbf7ef] p-4 text-sm text-neutral-700">
            Adding product to cart...
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-3xl font-semibold text-neutral-950">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-600">
              Add jewellery pieces from the shop, then continue to checkout.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.slug}
                className="grid gap-5 rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-4 md:grid-cols-[110px_1fr_auto]"
              >
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-white">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="px-3 text-center">
                      <div className="mx-auto h-4 w-4 rotate-45 bg-[#a77a25]" />
                      <p className="mt-3 text-xs font-semibold text-neutral-600">
                        Image coming soon
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                    {item.category || "Jewellery"}
                  </p>

                  <Link
                    href={`/product/${item.slug}`}
                    className="mt-2 block text-2xl font-semibold text-neutral-950 hover:text-[#a77a25]"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 font-semibold text-neutral-950">
                    {formatPrice(item.price)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                  <div className="flex items-center rounded-full border border-[#eadfca] bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.slug, item.quantity - 1)
                      }
                      className="px-4 py-2 text-lg"
                    >
                      −
                    </button>

                    <span className="min-w-10 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.slug, item.quantity + 1)
                      }
                      className="px-4 py-2 text-lg"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xl font-semibold text-neutral-950">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-semibold text-neutral-950">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4 border-b border-[#eadfca] pb-5">
          <div className="flex justify-between text-neutral-700">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-neutral-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-between text-2xl font-semibold text-neutral-950">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Link
          href={cartItems.length > 0 ? "/checkout" : "/shop"}
          className="mt-8 block rounded-full bg-[#a77a25] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950"
        >
          {cartItems.length > 0 ? "Proceed To Checkout" : "Shop Now"}
        </Link>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Final shipping, customs, and payment instructions are confirmed after
          order review.
        </p>
      </aside>
    </div>
  );
}
