"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: string;
  product_name?: string | null;
  name?: string | null;
  quantity: number;
  unit_price?: number | null;
  price?: number | null;
  line_total?: number | null;
  total?: number | null;
};

type AdminOrder = {
  id: string;
  reference?: string | null;
  order_number?: string | null;

  quote_request_id?: string | null;
  order_type?: string | null;
  deposit_percentage?: number | null;
  deposit_amount?: number | null;

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

  payment_method?: string | null;
  payment_status?: string | null;
  status?: string | null;
  notes?: string | null;

  created_at: string;
  updated_at?: string | null;
  order_items?: OrderItem[];
};

type OrderDraft = {
  status: string;
  paymentStatus: string;
  notes: string;
};

const orderStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "crafted", label: "Crafted" },
  { value: "quality_check", label: "Quality Check" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out For Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },

  { value: "deposit_pending", label: "Deposit Pending" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "in_production", label: "In Production" },
  { value: "production_completed", label: "Production Completed" },
];

const checkoutStatusOptions = orderStatusOptions.filter((status) =>
  [
    "pending",
    "confirmed",
    "processing",
    "crafted",
    "quality_check",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ].includes(status.value)
);

const depositStatusOptions = orderStatusOptions.filter((status) =>
  [
    "deposit_pending",
    "deposit_paid",
    "in_production",
    "production_completed",
    "shipped",
    "delivered",
    "cancelled",
  ].includes(status.value)
);

const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "awaiting_transfer", label: "Awaiting Transfer" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

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

function prettyOrderType(value?: string | null) {
  if (value === "quote_deposit") {
    return "Quote Deposit";
  }

  return "Checkout Order";
}

function isDepositOrder(order: AdminOrder) {
  return order.order_type === "quote_deposit";
}

function getOrderStatusOptions(order: AdminOrder) {
  return isDepositOrder(order) ? depositStatusOptions : checkoutStatusOptions;
}

function getItemName(item: OrderItem) {
  if (item.name && item.name !== "Jewellery Item") {
    return item.name;
  }

  if (item.product_name && item.product_name !== "Jewellery Item") {
    return item.product_name;
  }

  return item.name || item.product_name || "Jewellery Item";
}

function getItemTotal(item: OrderItem) {
  return (
    Number(item.line_total || 0) ||
    Number(item.total || 0) ||
    Number(item.price || 0) * Number(item.quantity || 1) ||
    Number(item.unit_price || 0) * Number(item.quantity || 1)
  );
}

function buildDrafts(orders: AdminOrder[]) {
  const nextDrafts: Record<string, OrderDraft> = {};

  orders.forEach((order) => {
    nextDrafts[order.id] = {
      status: order.status || "pending",
      paymentStatus: order.payment_status || "pending",
      notes: order.notes || "",
    };
  });

  return nextDrafts;
}

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [drafts, setDrafts] = useState<Record<string, OrderDraft>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load orders.");
      }

      const loadedOrders = result.orders || [];
      setOrders(loadedOrders);
      setDrafts(buildDrafts(loadedOrders));
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function updateDraft(orderId: string, key: keyof OrderDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        ...current[orderId],
        [key]: value,
      },
    }));
  }

  async function saveOrder(orderId: string) {
    const draft = drafts[orderId];

    if (!draft) {
      return;
    }

    setUpdatingId(orderId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: draft.status,
          paymentStatus: draft.paymentStatus,
          notes: draft.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to update order.");
      }

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? result.order : order))
      );

      setDrafts((current) => ({
        ...current,
        [orderId]: {
          status: result.order.status || "pending",
          paymentStatus: result.order.payment_status || "pending",
          notes: result.order.notes || "",
        },
      }));

      setSuccess("Order updated successfully.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update order."
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
            Orders
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
            Manage Customer Orders
          </h2>

          <p className="mt-2 text-neutral-600">
            Update checkout orders and custom quote deposit orders from here.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center text-neutral-600 shadow-sm">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
          <h3 className="text-3xl font-semibold text-neutral-950">
            No Orders Found
          </h3>

          <p className="mt-3 text-neutral-600">
            Customer checkout orders and deposit orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const draft = drafts[order.id] || {
              status: order.status || "pending",
              paymentStatus: order.payment_status || "pending",
              notes: order.notes || "",
            };

            return (
              <div
                key={order.id}
                className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-5 md:flex-row md:items-start">
                      <div>
                        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                          {order.reference || order.order_number}
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
                          {order.customer_name || "Customer Order"}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-600">
                          {order.customer_email || order.email}
                        </p>

                        <p className="mt-1 text-sm text-neutral-600">
                          WhatsApp: {order.whatsapp || "Not provided"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#fbf7ef] px-3 py-2 text-xs font-semibold text-neutral-700">
                            {prettyOrderType(order.order_type)}
                          </span>

                          {isDepositOrder(order) && (
                            <>
                              <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                                Deposit: {formatPrice(order.deposit_amount)}
                              </span>

                              <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-neutral-700">
                                {Number(order.deposit_percentage || 30)}%
                                Deposit
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-[#fbf7ef] p-5 md:text-right">
                        <p className="text-sm text-neutral-600">
                          {isDepositOrder(order)
                            ? "Deposit Total"
                            : "Order Total"}
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-neutral-950">
                          {formatPrice(order.total || order.total_amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <InfoBox
                        title="Order Status"
                        value={prettyStatus(order.status)}
                      />

                      <InfoBox
                        title="Payment Status"
                        value={prettyStatus(order.payment_status)}
                      />

                      <InfoBox
                        title="Date"
                        value={new Date(order.created_at).toLocaleDateString()}
                      />
                    </div>

                    <div className="mt-6">
                      <h4 className="text-xl font-semibold text-neutral-950">
                        Items
                      </h4>

                      <div className="mt-4 space-y-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 rounded-2xl bg-[#fbf7ef] p-4 text-sm"
                          >
                            <div>
                              <p className="font-semibold text-neutral-950">
                                {getItemName(item)}
                              </p>

                              <p className="mt-1 text-neutral-600">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="font-semibold text-neutral-950">
                              {formatPrice(getItemTotal(item))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-5">
                      <h4 className="font-semibold text-neutral-950">
                        Shipping Details
                      </h4>

                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {order.address || "No address"}, {order.city || ""}{" "}
                        {order.state || ""} {order.postal_code || ""},{" "}
                        {order.country || ""}
                      </p>
                    </div>

                    {isDepositOrder(order) && (
                      <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5">
                        <h4 className="font-semibold text-green-800">
                          Quote Deposit Order
                        </h4>

                        <p className="mt-3 text-sm leading-7 text-green-700">
                          This order was created from an approved custom quote.
                          Deposit payment is required before production starts.
                        </p>

                        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                          <div className="rounded-2xl bg-white p-4">
                            <p className="text-xs font-semibold tracking-[0.14em] text-green-700 uppercase">
                              Deposit Amount
                            </p>

                            <p className="mt-1 font-semibold text-neutral-950">
                              {formatPrice(order.deposit_amount)}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white p-4">
                            <p className="text-xs font-semibold tracking-[0.14em] text-green-700 uppercase">
                              Linked Quote
                            </p>

                            <p className="mt-1 break-all font-semibold text-neutral-950">
                              {order.quote_request_id || "Not linked"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl bg-[#fbf7ef] p-5">
                    <h4 className="text-xl font-semibold text-neutral-950">
                      Update Order
                    </h4>

                    <div className="mt-4 rounded-2xl border border-[#eadfca] bg-white p-4 text-sm leading-6 text-neutral-600">
                      {isDepositOrder(order)
                        ? "Suggested flow: Deposit Pending -> Deposit Paid -> In Production -> Production Completed."
                        : "Suggested flow: Pending -> Confirmed -> Processing -> Crafted -> Shipped -> Delivered."}
                    </div>

                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Order Status
                        </label>

                        <select
                          value={draft.status}
                          onChange={(event) =>
                            updateDraft(order.id, "status", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                        >
                          {getOrderStatusOptions(order).map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Payment Status
                        </label>

                        <select
                          value={draft.paymentStatus}
                          onChange={(event) =>
                            updateDraft(
                              order.id,
                              "paymentStatus",
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                        >
                          {paymentStatusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Admin Notes
                        </label>

                        <textarea
                          value={draft.notes}
                          onChange={(event) =>
                            updateDraft(order.id, "notes", event.target.value)
                          }
                          rows={5}
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                          placeholder="Add internal note..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => saveOrder(order.id)}
                        disabled={updatingId === order.id}
                        className="w-full rounded-full bg-[#a77a25] px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === order.id
                          ? "Updating..."
                          : "Save Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
