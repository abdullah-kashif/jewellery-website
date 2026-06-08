"use client";

import { useEffect, useState } from "react";

type PaymentOrder = {
  id: string;
  reference?: string | null;
  order_number?: string | null;
  order_type?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  email?: string | null;
  status?: string | null;
  payment_status?: string | null;
  total?: number | null;
  deposit_amount?: number | null;
  created_at?: string | null;
};

type PaymentConfirmation = {
  id: string;
  order_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  reference: string;
  amount?: number | null;
  payment_method?: string | null;
  transaction_id?: string | null;
  proof_url?: string | null;
  proof_file_name?: string | null;
  message?: string | null;
  status?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  order?: PaymentOrder | null;
};

type Draft = {
  status: string;
  adminNotes: string;
  markOrderPaid: boolean;
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
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

function buildDrafts(confirmations: PaymentConfirmation[]) {
  const nextDrafts: Record<string, Draft> = {};

  confirmations.forEach((confirmation) => {
    nextDrafts[confirmation.id] = {
      status: confirmation.status || "pending",
      adminNotes: confirmation.admin_notes || "",
      markOrderPaid: confirmation.status === "verified",
    };
  });

  return nextDrafts;
}

export function AdminPaymentConfirmationsClient() {
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadConfirmations() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/payment-confirmations", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Failed to load payment confirmations."
        );
      }

      const loadedConfirmations = result.paymentConfirmations || [];

      setConfirmations(loadedConfirmations);
      setDrafts(buildDrafts(loadedConfirmations));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load payment confirmations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfirmations();
  }, []);

  function updateDraft(
    confirmationId: string,
    key: keyof Draft,
    value: string | boolean
  ) {
    setDrafts((current) => ({
      ...current,
      [confirmationId]: {
        ...current[confirmationId],
        [key]: value,
      },
    }));
  }

  async function saveConfirmation(confirmationId: string) {
    const draft = drafts[confirmationId];

    if (!draft) {
      return;
    }

    const confirmAction = window.confirm(
      draft.markOrderPaid
        ? "Verify payment and mark linked order as paid?"
        : "Update this payment confirmation?"
    );

    if (!confirmAction) {
      return;
    }

    setUpdatingId(confirmationId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/payment-confirmations/${confirmationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: draft.status,
            adminNotes: draft.adminNotes,
            markOrderPaid: draft.markOrderPaid,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to update payment.");
      }

      setSuccess(result.message || "Payment confirmation updated.");

      await loadConfirmations();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update payment."
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
            Payments
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
            Payment Confirmations
          </h2>

          <p className="mt-2 text-neutral-600">
            Review customer payment proof, verify transfer, and mark orders as
            paid.
          </p>
        </div>

        <button
          type="button"
          onClick={loadConfirmations}
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
          Loading payment confirmations...
        </div>
      ) : confirmations.length === 0 ? (
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
          <h3 className="text-3xl font-semibold text-neutral-950">
            No Payment Proof Submitted
          </h3>

          <p className="mt-3 text-neutral-600">
            Customer payment confirmations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {confirmations.map((confirmation) => {
            const draft = drafts[confirmation.id] || {
              status: confirmation.status || "pending",
              adminNotes: confirmation.admin_notes || "",
              markOrderPaid: false,
            };

            const orderReference =
              confirmation.order?.reference ||
              confirmation.order?.order_number ||
              confirmation.reference;

            return (
              <div
                key={confirmation.id}
                className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-5 md:flex-row md:items-start">
                      <div>
                        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                          {orderReference}
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
                          {confirmation.customer_name || "Customer Payment"}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-600">
                          {confirmation.customer_email || "No email"}
                        </p>

                        <p className="mt-1 text-sm text-neutral-600">
                          Transaction ID:{" "}
                          <span className="font-semibold text-neutral-950">
                            {confirmation.transaction_id || "Not provided"}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#fbf7ef] p-5 md:text-right">
                        <p className="text-sm text-neutral-600">Amount</p>

                        <p className="mt-1 text-2xl font-semibold text-neutral-950">
                          {formatPrice(confirmation.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <InfoBox
                        title="Proof Status"
                        value={prettyStatus(confirmation.status)}
                      />

                      <InfoBox
                        title="Order Payment"
                        value={prettyStatus(
                          confirmation.order?.payment_status || "pending"
                        )}
                      />

                      <InfoBox
                        title="Submitted"
                        value={formatDate(confirmation.created_at)}
                      />
                    </div>

                    <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-5">
                      <h4 className="font-semibold text-neutral-950">
                        Customer Message
                      </h4>

                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {confirmation.message || "No message provided."}
                      </p>
                    </div>

                    <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-5">
                      <h4 className="font-semibold text-neutral-950">
                        Payment Proof
                      </h4>

                      <p className="mt-3 break-all text-sm leading-7 text-neutral-600">
                        {confirmation.proof_file_name || "No file name"}
                      </p>

                      {confirmation.proof_url ? (
                        <a
                          href={confirmation.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
                        >
                          Open Proof
                        </a>
                      ) : (
                        <p className="mt-4 text-sm text-red-600">
                          Proof URL not available.
                        </p>
                      )}
                    </div>

                    {confirmation.order && (
                      <div className="mt-6 rounded-3xl border border-[#eadfca] bg-white p-5">
                        <h4 className="font-semibold text-neutral-950">
                          Linked Order
                        </h4>

                        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                          <InfoBox
                            title="Order Status"
                            value={prettyStatus(confirmation.order.status)}
                          />

                          <InfoBox
                            title="Order Type"
                            value={
                              confirmation.order.order_type === "quote_deposit"
                                ? "Quote Deposit"
                                : "Checkout Order"
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl bg-[#fbf7ef] p-5">
                    <h4 className="text-xl font-semibold text-neutral-950">
                      Update Payment
                    </h4>

                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Confirmation Status
                        </label>

                        <select
                          value={draft.status}
                          onChange={(event) =>
                            updateDraft(
                              confirmation.id,
                              "status",
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <label className="flex gap-3 rounded-2xl border border-[#eadfca] bg-white p-4 text-sm text-neutral-700">
                        <input
                          type="checkbox"
                          checked={draft.markOrderPaid}
                          onChange={(event) =>
                            updateDraft(
                              confirmation.id,
                              "markOrderPaid",
                              event.target.checked
                            )
                          }
                          className="mt-1"
                        />

                        <span>
                          Mark linked order as{" "}
                          <strong className="text-neutral-950">Paid</strong>
                        </span>
                      </label>

                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Admin Notes
                        </label>

                        <textarea
                          value={draft.adminNotes}
                          onChange={(event) =>
                            updateDraft(
                              confirmation.id,
                              "adminNotes",
                              event.target.value
                            )
                          }
                          rows={5}
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                          placeholder="Example: Verified bank transfer successfully."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => saveConfirmation(confirmation.id)}
                        disabled={updatingId === confirmation.id}
                        className="w-full rounded-full bg-[#a77a25] px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === confirmation.id
                          ? "Updating..."
                          : "Save Payment Update"}
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