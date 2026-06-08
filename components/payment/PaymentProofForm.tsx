"use client";

import { useState } from "react";

type PaymentProofFormProps = {
  orderId: string;
  reference: string;
  alreadyPaid?: boolean;
};

export function PaymentProofForm({
  orderId,
  reference,
  alreadyPaid = false,
}: PaymentProofFormProps) {
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submitPaymentProof(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (alreadyPaid) {
      setError("This order is already marked as paid.");
      return;
    }

    if (!transactionId.trim()) {
      setError("Please enter your transaction ID.");
      return;
    }

    if (!proofFile) {
      setError("Please upload payment proof screenshot or PDF.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(proofFile.type)) {
      setError("Only JPG, PNG, WEBP, or PDF files are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (proofFile.size > maxSize) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("transactionId", transactionId.trim());
      formData.append("message", message.trim());
      formData.append("proof", proofFile);

      const response = await fetch("/api/customer/payment-confirmations", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to submit payment proof.");
      }

      setSuccess(
        "Payment proof submitted successfully. Our team will verify your payment soon."
      );

      setTransactionId("");
      setMessage("");
      setProofFile(null);
      setFileInputKey((current) => current + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit payment proof."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        Payment Proof
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
        Upload Payment Confirmation
      </h2>

      <p className="mt-3 leading-7 text-neutral-600">
        After bank transfer, upload your payment screenshot or receipt. Please
        mention this order reference:{" "}
        <strong className="text-neutral-950">{reference}</strong>
      </p>

      {alreadyPaid ? (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-700">
          This order is already marked as paid. No proof upload is required.
        </div>
      ) : (
        <form onSubmit={submitPaymentProof} className="mt-6 space-y-5">
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

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
              Transaction ID / Reference Number *
            </label>

            <input
              type="text"
              value={transactionId}
              onChange={(event) => setTransactionId(event.target.value)}
              placeholder="Example: TXN123456 / Bank reference number"
              className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
              Upload Proof *
            </label>

            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(event) =>
                setProofFile(event.target.files?.[0] || null)
              }
              className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#a77a25]"
            />

            <p className="mt-2 text-xs text-neutral-500">
              Accepted: JPG, PNG, WEBP, PDF. Maximum size: 5 MB.
            </p>

            {proofFile && (
              <p className="mt-2 text-sm font-medium text-neutral-700">
                Selected: {proofFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
              Message / Notes
            </label>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Example: Paid from account ending 1234."
              className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#a77a25] px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Payment Proof"}
          </button>
        </form>
      )}
    </div>
  );
}