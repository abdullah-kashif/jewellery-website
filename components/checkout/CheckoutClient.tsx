"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

export function CheckoutClient() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");

  useEffect(() => {
    setItems(readCartFromStorage());
    setMounted(true);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + Number(item.price || 0) * item.quantity,
      0
    );
  }, [items]);

  const shipping = items.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessReference("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!fullName || !email || !whatsapp || !country || !address || !city) {
      setError("Please fill all required billing and shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          country,
          address,
          city,
          state: stateValue,
          postalCode,
          notes,
          paymentMethod: "manual",
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event("luxora-cart-updated"));

      setItems([]);
      setSuccessReference(data.reference || data.order?.reference || "");
      setSuccessOrderId(data.order?.id || "");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to place order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 shadow-sm">
        Loading checkout...
      </div>
    );
  }

  if (successReference) {
    return (
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fbf7ef] text-3xl text-[#a77a25]">
          ✓
        </div>

        <h1 className="mt-6 text-4xl font-semibold text-neutral-950">
          Order Placed Successfully
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-600">
          Thank you. Your order has been saved. Track the order with your
          reference below. If you are logged in with the same email, you can
          upload payment proof from the payment instructions page.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-3xl bg-[#fbf7ef] p-6">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#a77a25] uppercase">
            Order Reference
          </p>

          <p className="mt-2 text-3xl font-semibold text-neutral-950">
            {successReference}
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/track-order?reference=${encodeURIComponent(successReference)}`}
            className="rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
          >
            Track Order
          </Link>

          {successOrderId ? (
            <Link
              href={`/payment-instructions/${successOrderId}`}
              className="rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950"
            >
              Payment Instructions
            </Link>
          ) : null}

          <Link
            href="/shop"
            className="rounded-full border border-[#eadfca] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase hover:bg-neutral-950 hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm"
      >
        <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
          Checkout
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-neutral-950">
          Billing & Shipping Details
        </h1>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 && (
          <div className="mt-6 rounded-2xl border border-[#eadfca] bg-[#fbf7ef] p-5 text-sm text-neutral-700">
            Your cart is empty.{" "}
            <Link href="/shop" className="font-semibold text-[#a77a25]">
              Go to shop
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Field
            label="Full Name *"
            value={fullName}
            onChange={setFullName}
            placeholder="Your full name"
          />

          <Field
            label="Email *"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />

          <Field
            label="WhatsApp *"
            value={whatsapp}
            onChange={setWhatsapp}
            placeholder="+92 300 0000000"
          />

          <Field
            label="Country *"
            value={country}
            onChange={setCountry}
            placeholder="Pakistan"
          />

          <Field
            label="Address *"
            value={address}
            onChange={setAddress}
            placeholder="House, street, area"
          />

          <Field
            label="City *"
            value={city}
            onChange={setCity}
            placeholder="Karachi"
          />

          <Field
            label="State / Province"
            value={stateValue}
            onChange={setStateValue}
            placeholder="Sindh"
          />

          <Field
            label="Postal Code"
            value={postalCode}
            onChange={setPostalCode}
            placeholder="75600"
          />
        </div>

        <label className="mt-5 block">
          <span className="text-xs font-semibold tracking-[0.22em] text-neutral-950 uppercase">
            Notes
          </span>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            placeholder="Any special instruction..."
            className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 outline-none focus:border-[#a77a25]"
          />
        </label>

        <div className="mt-8 rounded-3xl bg-[#fbf7ef] p-6">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Payment Method
          </h2>

          <label className="mt-4 flex gap-3 text-sm font-semibold text-neutral-900">
            <input type="radio" checked readOnly />
            Manual confirmation / bank transfer / WhatsApp confirmation
          </label>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Online payment gateway can be added later. For now, order will be
            saved and admin can mark payment as paid after confirmation.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="mt-8 w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-semibold text-neutral-950">
          Your Order
        </h2>

        {items.length === 0 ? (
          <p className="mt-5 text-neutral-600">No items in cart.</p>
        ) : (
          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={item.slug}
                className="border-b border-[#eadfca] pb-4 last:border-b-0"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-neutral-950">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-neutral-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-neutral-950">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4 border-t border-[#eadfca] pt-5">
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
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-[0.22em] text-neutral-950 uppercase">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 outline-none focus:border-[#a77a25]"
      />
    </label>
  );
}
