"use client";

import { useEffect, useState } from "react";

type AdminQuote = {
  id: string;
  reference?: string | null;
  customer_user_id?: string | null;
  full_name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  country?: string | null;

  product?: string | null;
  product_type?: string | null;

  metal?: string | null;
  metal_type?: string | null;

  gold_karat?: string | null;

  stone?: string | null;
  stone_type?: string | null;

  size?: string | null;
  ring_size?: string | null;

  budget?: string | null;
  budget_range?: string | null;

  message?: string | null;
  additional_message?: string | null;

  reference_image_name?: string | null;
  image_url?: string | null;

  status?: string | null;
  quoted_price?: number | null;
  admin_notes?: string | null;

  created_at: string;
  updated_at?: string | null;
};

type QuoteDraft = {
  status: string;
  quotedPrice: string;
  adminNotes: string;
};

const quoteStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) {
    return "Not quoted";
  }

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

function buildDrafts(quotes: AdminQuote[]) {
  const nextDrafts: Record<string, QuoteDraft> = {};

  quotes.forEach((quote) => {
    nextDrafts[quote.id] = {
      status: quote.status || "pending",
      quotedPrice:
        quote.quoted_price === null || quote.quoted_price === undefined
          ? ""
          : String(quote.quoted_price),
      adminNotes: quote.admin_notes || "",
    };
  });

  return nextDrafts;
}

export function AdminQuotesClient() {
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [drafts, setDrafts] = useState<Record<string, QuoteDraft>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadQuotes() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/quotes", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load quote requests.");
      }

      const loadedQuotes = result.quotes || [];
      setQuotes(loadedQuotes);
      setDrafts(buildDrafts(loadedQuotes));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load quote requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, []);

  function updateDraft(quoteId: string, key: keyof QuoteDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [quoteId]: {
        ...current[quoteId],
        [key]: value,
      },
    }));
  }

  async function saveQuote(quoteId: string) {
    const draft = drafts[quoteId];

    if (!draft) {
      return;
    }

    setUpdatingId(quoteId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: draft.status,
          quotedPrice: draft.quotedPrice,
          adminNotes: draft.adminNotes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to update quote request.");
      }

      setQuotes((current) =>
        current.map((quote) => (quote.id === quoteId ? result.quote : quote))
      );

      setDrafts((current) => ({
        ...current,
        [quoteId]: {
          status: result.quote.status || "pending",
          quotedPrice:
            result.quote.quoted_price === null ||
            result.quote.quoted_price === undefined
              ? ""
              : String(result.quote.quoted_price),
          adminNotes: result.quote.admin_notes || "",
        },
      }));

      setSuccess("Quote request updated successfully.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update quote request."
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
            Quotes
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
            Manage Custom Quote Requests
          </h2>

          <p className="mt-2 text-neutral-600">
            Review customer custom jewellery requests, add quoted price, and
            update quote status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadQuotes}
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
          Loading quote requests...
        </div>
      ) : quotes.length === 0 ? (
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
          <h3 className="text-3xl font-semibold text-neutral-950">
            No Quote Requests Found
          </h3>

          <p className="mt-3 text-neutral-600">
            Custom jewellery quote requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote) => {
            const draft = drafts[quote.id] || {
              status: quote.status || "pending",
              quotedPrice:
                quote.quoted_price === null || quote.quoted_price === undefined
                  ? ""
                  : String(quote.quoted_price),
              adminNotes: quote.admin_notes || "",
            };

            const productType =
              quote.product_type || quote.product || "Custom Jewellery";
            const metalType =
              quote.metal_type || quote.metal || "Not selected";
            const stoneType =
              quote.stone_type || quote.stone || "Not selected";
            const size = quote.size || quote.ring_size || "Not provided";
            const budget =
              quote.budget || quote.budget_range || "Not provided";
            const customerMessage =
              quote.message || quote.additional_message || "";

            return (
              <div
                key={quote.id}
                className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] pb-5 md:flex-row md:items-start">
                      <div>
                        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                          {quote.reference || "Quote Request"}
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold text-neutral-950">
                          {productType}
                        </h3>

                        <p className="mt-2 text-sm text-neutral-600">
                          {quote.full_name || "Customer"} ·{" "}
                          {quote.email || "No email"}
                        </p>

                        <p className="mt-1 text-sm text-neutral-600">
                          WhatsApp: {quote.whatsapp || "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#fbf7ef] p-5 md:text-right">
                        <p className="text-sm text-neutral-600">
                          Quoted Price
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-neutral-950">
                          {formatPrice(quote.quoted_price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <InfoBox title="Status" value={prettyStatus(quote.status)} />
                      <InfoBox
                        title="Date"
                        value={new Date(quote.created_at).toLocaleDateString()}
                      />
                      <InfoBox
                        title="Country"
                        value={quote.country || "Not provided"}
                      />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <InfoBox title="Product Type" value={productType} />
                      <InfoBox title="Metal" value={metalType} />
                      <InfoBox
                        title="Gold Karat"
                        value={quote.gold_karat || "Not selected"}
                      />
                      <InfoBox title="Stone" value={stoneType} />
                      <InfoBox title="Size" value={size} />
                      <InfoBox title="Budget" value={budget} />
                    </div>

                    {customerMessage && (
                      <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-5">
                        <h4 className="font-semibold text-neutral-950">
                          Customer Message
                        </h4>

                        <p className="mt-3 text-sm leading-7 text-neutral-600">
                          {customerMessage}
                        </p>
                      </div>
                    )}

{(quote.reference_image_name || quote.image_url) && (
  <QuoteReferenceImage
    imageUrl={quote.image_url || ""}
    imageName={quote.reference_image_name || "Reference image"}
    reference={quote.reference || quote.id}
  />
)}
                  </div>

                  <div className="rounded-3xl bg-[#fbf7ef] p-5">
                    <h4 className="text-xl font-semibold text-neutral-950">
                      Update Quote
                    </h4>

                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Quote Status
                        </label>

                        <select
                          value={draft.status}
                          onChange={(event) =>
                            updateDraft(quote.id, "status", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                        >
                          {quoteStatusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Quoted Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={draft.quotedPrice}
                          onChange={(event) =>
                            updateDraft(
                              quote.id,
                              "quotedPrice",
                              event.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                          placeholder="Example: 1200"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                          Admin Note
                        </label>

                        <textarea
                          value={draft.adminNotes}
                          onChange={(event) =>
                            updateDraft(
                              quote.id,
                              "adminNotes",
                              event.target.value
                            )
                          }
                          rows={6}
                          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                          placeholder="Example: Price valid for 48 hours because gold/diamond rates change."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => saveQuote(quote.id)}
                        disabled={updatingId === quote.id}
                        className="w-full rounded-full bg-[#a77a25] px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === quote.id
                          ? "Updating..."
                          : "Save Quote Update"}
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

function QuoteReferenceImage({
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
    <div className="mt-6 overflow-hidden rounded-3xl border border-[#eadfca] bg-[#fbf7ef]">
      <div className="flex flex-col justify-between gap-4 border-b border-[#eadfca] bg-white p-5 md:flex-row md:items-center">
        <div>
          <h4 className="font-semibold text-neutral-950">Reference Image</h4>

          <p className="mt-1 break-all text-sm text-neutral-500">
            {imageName}
          </p>
        </div>

        {imageUrl && (
          <div className="flex flex-wrap gap-3">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white hover:bg-[#a77a25]"
            >
              Open Image
            </a>

            <a
              href={imageUrl}
              download={downloadName}
              className="rounded-full border border-[#d6b46a] bg-white px-5 py-2 text-sm font-semibold text-[#a77a25] hover:bg-[#fbf7ef]"
            >
              Download
            </a>
          </div>
        )}
      </div>

      {imageUrl ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          className="block bg-white"
        >
          <img
            src={imageUrl}
            alt={imageName}
            className="h-80 w-full object-cover transition hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="p-5 text-sm text-neutral-600">
          Image name saved, but image URL is not available.
        </div>
      )}
    </div>
  );
}