"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { CustomerProfile } from "@/lib/customer-profile";
import type { CustomerOrder } from "@/lib/customer-orders";
import type { CustomerQuoteRequest } from "@/lib/customer-quotes";

type CustomerAccountDashboardProps = {
  email: string;
  profile: CustomerProfile | null;
  orders: CustomerOrder[];
  quoteRequests: CustomerQuoteRequest[];
};

function formatPrice(value?: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function prettyStatus(value?: string | null) {
  const cleanValue = String(value || "pending").replaceAll("_", " ");
  return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
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

function getStatusClass(status?: string | null) {
  if (status === "approved" || status === "deposit_pending") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "quoted") {
    return "border-[#d6b46a] bg-[#fff8e6] text-[#8a651d]";
  }

  if (status === "rejected" || status === "cancelled") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-[#eadfca] bg-white text-neutral-700";
}

function getOrderTotal(order: CustomerOrder) {
  const orderWithFallback = order as CustomerOrder & {
    total_amount?: number | null;
    deposit_amount?: number | null;
  };

  return Number(
    order.total ??
      orderWithFallback.total_amount ??
      orderWithFallback.deposit_amount ??
      0
  );
}

function getOrderReference(order: CustomerOrder) {
  const orderWithFallback = order as CustomerOrder & {
    reference?: string | null;
    order_number?: string | null;
  };

  return String(
    orderWithFallback.reference || orderWithFallback.order_number || order.id
  ).trim();
}

function isOrderPaid(order: CustomerOrder) {
  return String(order.payment_status || "").toLowerCase() === "paid";
}

function getTrackOrderHref(order: CustomerOrder, email: string) {
  const reference = getOrderReference(order);

  return `/track-order?reference=${encodeURIComponent(
    reference
  )}&email=${encodeURIComponent(email)}`;
}

export function CustomerAccountDashboard({
  email,
  profile,
  orders,
  quoteRequests,
}: CustomerAccountDashboardProps) {
  const router = useRouter();

  const [quotes, setQuotes] = useState<CustomerQuoteRequest[]>(quoteRequests);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState("");
  const [creatingDepositId, setCreatingDepositId] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState("");

  async function logout() {
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function approveQuote(quoteId: string) {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this quotation?"
    );

    if (!confirmApprove) {
      return;
    }

    setApprovingId(quoteId);
    setQuoteError("");
    setQuoteSuccess("");

    try {
      const response = await fetch(`/api/customer/quotes/${quoteId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerResponse: "Customer approved the quotation.",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to approve quote.");
      }

      setQuotes((current) =>
        current.map((quote) => (quote.id === quoteId ? result.quote : quote))
      );

      setQuoteSuccess(
        "Quote approved successfully. You can now create a deposit order."
      );

      router.refresh();
    } catch (error) {
      setQuoteError(
        error instanceof Error ? error.message : "Failed to approve quote."
      );
    } finally {
      setApprovingId("");
    }
  }

  async function createDepositOrder(quoteId: string) {
    const confirmCreate = window.confirm(
      "Create a 30% deposit order for this approved quotation?"
    );

    if (!confirmCreate) {
      return;
    }

    setCreatingDepositId(quoteId);
    setQuoteError("");
    setQuoteSuccess("");

    try {
      const response = await fetch(
        `/api/customer/quotes/${quoteId}/create-deposit-order`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to create deposit order.");
      }

      setQuotes((current) =>
        current.map((quote) => (quote.id === quoteId ? result.quote : quote))
      );

      setQuoteSuccess(
        "Deposit order created successfully. Please check My Orders for payment status."
      );

      router.refresh();
    } catch (error) {
      setQuoteError(
        error instanceof Error
          ? error.message
          : "Failed to create deposit order."
      );
    } finally {
      setCreatingDepositId("");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
              My Account
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
              Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>

            <p className="mt-4 leading-7 text-neutral-600">
              Manage your jewellery orders, quote requests, wishlist, and
              profile information.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/track-order"
                className="rounded-full bg-neutral-950 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
              >
                Track Order
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-[#d6b46a] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-[#a77a25] uppercase hover:bg-[#fbf7ef]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={loading}
            className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoCard title="Email" value={email} />
          <InfoCard title="Phone" value={profile?.phone || "Not added"} />
          <InfoCard title="Country" value={profile?.country || "Not added"} />
          <InfoCard title="Address" value={profile?.address || "Not added"} />
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold text-neutral-950">
            My Orders
          </h2>

          <Link
            href="/track-order"
            className="rounded-full bg-neutral-950 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
          >
            Track Any Order
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-6 text-neutral-600">
            No orders found yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const orderReference = getOrderReference(order);

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                        {orderReference}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
                        {formatPrice(getOrderTotal(order))}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {prettyStatus(order.status)} / Payment:{" "}
                        {prettyStatus(order.payment_status)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={getTrackOrderHref(order, email)}
                          className="inline-block rounded-full bg-neutral-950 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
                        >
                          Track Order
                        </Link>

                        {!isOrderPaid(order) && (
                          <Link
                            href={`/payment-instructions/${order.id}`}
                            className="inline-block rounded-full bg-[#a77a25] px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-neutral-950"
                          >
                            Payment Instructions
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-700">
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {order.order_items?.map((item) => {
                      const safeItem = item as typeof item & {
                        product_name?: string | null;
                        name?: string | null;
                        product_title?: string | null;
                        quantity?: number | null;
                        qty?: number | null;
                        line_total?: number | null;
                        total?: number | null;
                        unit_price?: number | null;
                        price?: number | null;
                      };

                      const quantity = Number(
                        safeItem.quantity ?? safeItem.qty ?? 1
                      );

                      const itemName =
                        safeItem.product_name ||
                        safeItem.name ||
                        safeItem.product_title ||
                        "Jewellery item";

                      const itemTotal = Number(
                        safeItem.line_total ??
                          safeItem.total ??
                          Number(safeItem.unit_price ?? safeItem.price ?? 0) *
                            quantity
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 text-sm text-neutral-700"
                        >
                          <span>
                            {itemName} × {quantity}
                          </span>

                          <span>{formatPrice(itemTotal)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-neutral-950">My Quotes</h2>

        {quoteError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {quoteError}
          </div>
        )}

        {quoteSuccess && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {quoteSuccess}
          </div>
        )}

        {quotes.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-6 text-neutral-600">
            No custom quote requests found yet.
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {quotes.map((quote) => {
              const productType =
                quote.product_type || quote.product || "Custom Jewellery";

              const metalType =
                quote.metal_type || quote.metal || "Not selected";

              const stoneType =
                quote.stone_type || quote.stone || "Not selected";

              const budget =
                quote.budget || quote.budget_range || "Not provided";

              const canApprove =
                quote.status === "quoted" &&
                quote.quoted_price !== null &&
                quote.quoted_price !== undefined;

              const canCreateDeposit =
                quote.status === "approved" &&
                quote.quoted_price !== null &&
                quote.quoted_price !== undefined &&
                !quote.deposit_order_id;

              return (
                <div
                  key={quote.id}
                  className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                        {quote.reference || "Quote Request"}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
                        {productType}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-4 py-2 text-xs font-semibold ${getStatusClass(
                            quote.status
                          )}`}
                        >
                          {prettyStatus(quote.status)}
                        </span>

                        {quote.quoted_price !== null &&
                          quote.quoted_price !== undefined && (
                            <span className="rounded-full border border-[#d6b46a] bg-white px-4 py-2 text-xs font-semibold text-[#8a651d]">
                              Quote: {formatPrice(quote.quoted_price)}
                            </span>
                          )}

                        {quote.deposit_amount !== null &&
                          quote.deposit_amount !== undefined && (
                            <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                              Deposit: {formatPrice(quote.deposit_amount)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-700">
                      {formatDate(quote.created_at)}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
                    <QuoteInfo label="Metal" value={metalType} />
                    <QuoteInfo label="Stone" value={stoneType} />

                    <QuoteInfo
                      label="Gold Karat"
                      value={quote.gold_karat || "Not selected"}
                    />

                    <QuoteInfo
                      label="Size"
                      value={quote.size || quote.ring_size || "Not provided"}
                    />

                    <QuoteInfo label="Budget" value={budget} />

                    <QuoteInfo
                      label="Country"
                      value={quote.country || "Not provided"}
                    />
                  </div>

                  {(quote.message || quote.additional_message) && (
                    <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-neutral-700">
                      {quote.message || quote.additional_message}
                    </div>
                  )}

                  {(quote.image_url || quote.reference_image_name) && (
                    <CustomerQuoteImage
                      imageUrl={quote.image_url || ""}
                      imageName={quote.reference_image_name || "Reference image"}
                      reference={quote.reference || quote.id}
                    />
                  )}

                  {quote.admin_notes && (
                    <div className="mt-5 rounded-2xl border border-[#d6b46a] bg-white p-4 text-sm text-neutral-700">
                      <strong>Admin Note:</strong> {quote.admin_notes}
                    </div>
                  )}

                  {canApprove && (
                    <div className="mt-5 rounded-2xl border border-[#d6b46a] bg-white p-5">
                      <h4 className="text-xl font-semibold text-neutral-950">
                        Quotation Ready
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Your quotation is ready. Price can change if gold,
                        diamond, or gemstone rates change. Approve this quote to
                        continue with deposit/payment confirmation.
                      </p>

                      <button
                        type="button"
                        onClick={() => approveQuote(quote.id)}
                        disabled={approvingId === quote.id}
                        className="mt-5 rounded-full bg-[#a77a25] px-6 py-3 text-sm font-semibold tracking-[0.16em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {approvingId === quote.id
                          ? "Approving..."
                          : "Approve Quote"}
                      </button>
                    </div>
                  )}

                  {canCreateDeposit && (
                    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                      <h4 className="text-xl font-semibold text-green-800">
                        Quote Approved
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-green-700">
                        Your quote has been approved. You can now create a 30%
                        deposit order to continue production confirmation.
                      </p>

                      <button
                        type="button"
                        onClick={() => createDepositOrder(quote.id)}
                        disabled={creatingDepositId === quote.id}
                        className="mt-5 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold tracking-[0.16em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {creatingDepositId === quote.id
                          ? "Creating..."
                          : "Create Deposit Order"}
                      </button>
                    </div>
                  )}

                  {quote.deposit_order_id && (
                    <div className="mt-5 rounded-2xl border border-[#d6b46a] bg-white p-5 text-sm text-neutral-700">
                      <strong>Deposit Order Created:</strong>{" "}
                      {quote.deposit_amount !== null &&
                      quote.deposit_amount !== undefined
                        ? formatPrice(quote.deposit_amount)
                        : "Deposit amount saved"}
                      . Please check My Orders for payment status.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <AccountCard
          title="Track Order"
          description="Check your jewellery order status, payment confirmation, and shipment progress."
          href="/track-order"
          buttonLabel="Track Order"
        />

        <AccountCard
          title="Need Support?"
          description="Contact us with your order reference or quote reference for faster support."
          href="/contact"
          buttonLabel="Contact Support"
        />
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#fbf7ef] p-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-[#a77a25] uppercase">
        {title}
      </p>

      <p className="mt-2 font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function QuoteInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold tracking-[0.14em] text-[#a77a25] uppercase">
        {label}
      </p>

      <p className="mt-1 font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function CustomerQuoteImage({
  imageUrl,
  imageName,
  reference,
}: {
  imageUrl: string;
  imageName: string;
  reference: string;
}) {
  const downloadName = `${reference}-${imageName}`.replaceAll(" ", "-");

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#eadfca] bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-[#eadfca] p-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#a77a25] uppercase">
            Reference Image
          </p>

          <p className="mt-1 break-all text-sm text-neutral-500">
            {imageName}
          </p>
        </div>

        {imageUrl && (
          <div className="flex flex-wrap gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white hover:bg-[#a77a25]"
            >
              Open
            </a>

            <a
              href={imageUrl}
              download={downloadName}
              className="rounded-full border border-[#d6b46a] px-4 py-2 text-xs font-semibold text-[#a77a25] hover:bg-[#fbf7ef]"
            >
              Download
            </a>
          </div>
        )}
      </div>

      {imageUrl ? (
        <a href={imageUrl} target="_blank" rel="noreferrer" className="block">
          <img
            src={imageUrl}
            alt={imageName}
            className="h-72 w-full object-cover transition hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="p-4 text-sm text-neutral-600">
          Image name saved, but image URL is not available.
        </div>
      )}
    </div>
  );
}

function AccountCard({
  title,
  description,
  href,
  buttonLabel,
}: {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbf7ef] text-[#a77a25]">
        ◆
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-neutral-950">{title}</h2>

      <p className="mt-3 leading-7 text-neutral-600">{description}</p>

      <Link
        href={href}
        className="mt-6 inline-block rounded-full bg-neutral-950 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}