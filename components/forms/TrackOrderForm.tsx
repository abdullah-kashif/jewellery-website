"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type OrderStatus =
  | "Order Placed"
  | "Payment Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type SupabaseOrderItem = {
  id: string;
  order_id: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  created_at: string;
};

type SupabaseOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  whatsapp: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string | null;
  order_items: SupabaseOrderItem[];
};

type TrackOrderFormProps = {
  initialOrderNumber?: string;
};

const statusSteps: OrderStatus[] = [
  "Order Placed",
  "Payment Pending",
  "Processing",
  "Shipped",
  "Delivered",
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getActiveStep(status: OrderStatus) {
  if (status === "Cancelled") {
    return -1;
  }

  return statusSteps.indexOf(status);
}

export function TrackOrderForm({
  initialOrderNumber = "",
}: TrackOrderFormProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<SupabaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoSearched, setAutoSearched] = useState(false);
  const [error, setError] = useState("");

  async function searchOrder(nextOrderNumber: string) {
    const cleanOrderNumber = nextOrderNumber.trim().toUpperCase();

    if (!cleanOrderNumber) {
      setError("Please enter your order number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: cleanOrderNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to track order.");
      }

      setOrder(result.order);
      setOrderNumber(cleanOrderNumber);
    } catch (trackError) {
      setError(
        trackError instanceof Error
          ? trackError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchOrder(orderNumber);
  }

  useEffect(() => {
    if (initialOrderNumber && !autoSearched) {
      setAutoSearched(true);
      searchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber, autoSearched]);

  const activeStep = order ? getActiveStep(order.status) : -1;

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Order Number
        </label>

        <div className="flex flex-col gap-4 md:flex-row">
          <input
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            placeholder="Example: LXO-123456"
            className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm uppercase outline-none transition focus:border-[#a77a25]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Enter the order number you received after checkout.
        </p>
      </form>

      {order && (
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-5 border-b border-[#eadfca] pb-6 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                  {order.order_number}
                </p>

                <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
                  Hello, {order.customer_name}
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  Ordered on {formatDate(order.created_at)}
                </p>
              </div>

              <div className="rounded-full bg-[#fbf7ef] px-5 py-3 text-sm font-semibold text-neutral-950">
                Status:{" "}
                <span className="text-[#a77a25]">{order.status}</span>
              </div>
            </div>

            {order.status === "Cancelled" ? (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                This order has been cancelled. Please contact support if you
                need more information.
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-5">
                {statusSteps.map((step, index) => {
                  const isActive = index <= activeStep;

                  return (
                    <div
                      key={step}
                      className={`rounded-2xl border p-4 text-center ${
                        isActive
                          ? "border-[#d6b46a] bg-[#fbf7ef]"
                          : "border-[#eadfca] bg-white"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                          isActive
                            ? "bg-[#a77a25] text-white"
                            : "bg-[#f2eadc] text-neutral-500"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p
                        className={`mt-3 text-sm font-semibold ${
                          isActive ? "text-neutral-950" : "text-neutral-500"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-2xl font-semibold text-neutral-950">
                Order Items
              </h3>

              <div className="mt-6 space-y-4">
                {(order.order_items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 rounded-2xl bg-[#fbf7ef] p-4 text-sm"
                  >
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-semibold text-neutral-950 hover:text-[#a77a25]"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-neutral-600">
                        Qty {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="font-semibold text-neutral-950">
                      {formatPrice(Number(item.quantity) * Number(item.price))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-2xl font-semibold text-neutral-950">
                Order Summary
              </h3>

              <div className="mt-5 space-y-3 text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-950">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-950">
                    {formatPrice(order.shipping)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[#eadfca] pt-4 text-lg">
                  <span className="font-semibold text-neutral-950">Total</span>
                  <span className="font-semibold text-neutral-950">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fbf7ef] p-4 text-sm leading-6 text-neutral-600">
                <p>Email: {order.email}</p>
                <p>WhatsApp: {order.whatsapp}</p>
                <p>Country: {order.country}</p>
                <p>Payment: {order.payment_method.replace("-", " ")}</p>
              </div>

              <Link
                href="/contact"
                className="mt-6 block rounded-full bg-neutral-950 px-6 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
              >
                Contact Support
              </Link>
            </aside>
          </section>
        </div>
      )}
    </div>
  );
}