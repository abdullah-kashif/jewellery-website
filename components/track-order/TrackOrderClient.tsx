"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type TrackedOrder = {
  id: string;
  reference?: string | null;
  order_number?: string | null;
  order_type?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  subtotal?: number | null;
  shipping?: number | null;
  total?: number | null;
  total_amount?: number | null;
  deposit_amount?: number | null;
  status?: string | null;
  payment_status?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type TrackedOrderItem = {
  id?: string;
  order_id?: string;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  price?: number | null;
  quantity?: number | null;
  subtotal?: number | null;
  total?: number | null;
  unit_price?: number | null;
  image_url?: string | null;
};

type TrackResult = {
  order: TrackedOrder;
  items: TrackedOrderItem[];
};

const statusSteps = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "crafted", label: "Crafted" },
  { key: "quality_check", label: "Quality Check" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out For Delivery" },
  { key: "delivered", label: "Delivered" },
];

function prettyStatus(value?: string | null) {
  const cleanValue = String(value || "pending").replace(/_/g, " ");
  return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
}

function formatPrice(value?: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getOrderTotal(order: TrackedOrder) {
  return Number(order.total ?? order.total_amount ?? 0);
}

function getActiveStep(status?: string | null) {
  const cleanStatus = String(status || "pending");

  if (cleanStatus === "cancelled" || cleanStatus === "rejected") {
    return -1;
  }

  if (cleanStatus === "deposit_paid") {
    return 1;
  }

  const index = statusSteps.findIndex((step) => step.key === cleanStatus);
  return index >= 0 ? index : 0;
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#fbf7ef] p-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-[#a77a25] uppercase">
        {title}
      </p>

      <p className="mt-2 font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialReference = searchParams.get("reference") || "";

  const [reference, setReference] = useState(initialReference);
  const [email, setEmail] = useState("");
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  async function searchOrder(referenceValue = reference, emailValue = email) {
    setTracking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: referenceValue,
          email: emailValue,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to track order.");
      }

      setResult({
        order: data.order,
        items: data.items || [],
      });
    } catch (trackError) {
      setError(
        trackError instanceof Error
          ? trackError.message
          : "Failed to track order."
      );
    } finally {
      setTracking(false);
    }
  }

  useEffect(() => {
    if (initialReference) {
      searchOrder(initialReference, "");
    }
    // Run once for the URL-provided reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await searchOrder();
  }

  const activeStep = result ? getActiveStep(result.order.status) : 0;

  const orderReference = result
    ? result.order.reference || result.order.order_number || reference
    : reference;

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
          Track Order
        </p>

        <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
          Track Your Jewellery Order
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
          Enter your order reference to check status, payment confirmation, and
          delivery progress.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-5 md:grid-cols-[1fr_1fr_auto]"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
              Order Reference
            </span>

            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              required
              className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
              placeholder="Example: LXO-123456"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
              Email Optional
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
              placeholder="customer@email.com"
            />
          </label>

          <button
            type="submit"
            disabled={tracking}
            className="self-end rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {tracking ? "Tracking..." : "Track Order"}
          </button>
        </form>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      {result ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col justify-between gap-5 border-b border-[#eadfca] pb-6 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                    {orderReference}
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
                    {result.order.customer_name || "Customer Order"}
                  </h2>

                  <p className="mt-2 text-sm text-neutral-600">
                    Order Date: {formatDate(result.order.created_at)}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#fbf7ef] p-5 md:text-right">
                  <p className="text-sm text-neutral-600">Order Total</p>

                  <p className="mt-1 text-2xl font-semibold text-neutral-950">
                    {formatPrice(getOrderTotal(result.order))}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfoBox
                  title="Order Status"
                  value={prettyStatus(result.order.status)}
                />

                <InfoBox
                  title="Payment Status"
                  value={prettyStatus(result.order.payment_status)}
                />

                <InfoBox
                  title="Order Type"
                  value={
                    result.order.order_type === "quote_deposit"
                      ? "Quote Deposit"
                      : "Checkout Order"
                  }
                />
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-neutral-950">
                  Order Progress
                </h3>

                {activeStep === -1 ? (
                  <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                    This order is currently marked as{" "}
                    {prettyStatus(result.order.status)}.
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statusSteps.map((step, index) => {
                      const isActive = index <= activeStep;

                      return (
                        <div
                          key={step.key}
                          className={`rounded-3xl border p-5 text-center ${
                            isActive
                              ? "border-[#d6b46a] bg-[#fbf7ef] text-neutral-950"
                              : "border-[#eadfca] bg-white text-neutral-500"
                          }`}
                        >
                          <div
                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                              isActive
                                ? "bg-[#d6b46a] text-neutral-950"
                                : "bg-[#fbf7ef]"
                            }`}
                          >
                            {isActive ? "✓" : index + 1}
                          </div>

                          <p className="mt-3 text-sm font-semibold">
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-2xl font-semibold text-neutral-950">
                Order Items
              </h3>

              {result.items.length === 0 ? (
                <p className="mt-4 text-neutral-600">
                  No item details found for this order.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {result.items.map((item, index) => {
                    const itemTotal =
                      Number(item.subtotal ?? item.total ?? 0) ||
                      Number(item.unit_price || 0) *
                        Number(item.quantity || 1) ||
                      Number(item.price || 0) * Number(item.quantity || 1);

                    return (
                      <div
                        key={item.id || index}
                        className="flex flex-col justify-between gap-4 rounded-3xl bg-[#fbf7ef] p-5 md:flex-row md:items-center"
                      >
                        <div>
                          <h4 className="font-semibold text-neutral-950">
                            {item.name || "Jewellery Item"}
                          </h4>

                          <p className="mt-1 text-sm text-neutral-600">
                            Qty: {item.quantity || 1}
                            {item.category ? ` / ${item.category}` : ""}
                          </p>
                        </div>

                        <p className="font-semibold text-neutral-950">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-neutral-950">
                Delivery Details
              </h3>

              <div className="mt-5 space-y-4 text-sm text-neutral-600">
                <p>
                  <strong className="text-neutral-950">Country:</strong>{" "}
                  {result.order.country || "Not available"}
                </p>

                <p>
                  <strong className="text-neutral-950">City:</strong>{" "}
                  {result.order.city || "Not available"}
                </p>

                <p>
                  <strong className="text-neutral-950">Address:</strong>{" "}
                  {result.order.address || "Not available"}
                </p>

                <p>
                  <strong className="text-neutral-950">WhatsApp:</strong>{" "}
                  {result.order.whatsapp || "Not available"}
                </p>
              </div>
            </div>

            {result.order.payment_status !== "paid" ? (
              <div className="rounded-[2rem] bg-neutral-950 p-6 text-white shadow-sm">
                <h3 className="text-2xl font-semibold">Payment Pending</h3>

                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  Your payment is still pending. Upload payment proof from the
                  payment instructions page.
                </p>

                <Link
                  href={`/payment-instructions/${result.order.id}`}
                  className="mt-6 inline-block rounded-full bg-[#d6b46a] px-6 py-3 text-sm font-semibold tracking-[0.16em] text-neutral-950 uppercase hover:bg-white"
                >
                  Payment Instructions
                </Link>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-neutral-950">
                Need Help?
              </h3>

              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Contact our support team with your order reference for quick
                assistance.
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-block rounded-full border border-[#a77a25] px-6 py-3 text-sm font-semibold tracking-[0.16em] text-[#a77a25] uppercase hover:bg-[#a77a25] hover:text-white"
              >
                Contact Support
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
