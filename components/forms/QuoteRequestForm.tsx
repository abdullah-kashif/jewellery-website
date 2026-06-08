"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";

type QuoteRequestFormProps = {
  initialProduct?: string;
  initialType?: string;
  initialStone?: string;
};

export function QuoteRequestForm({
  initialProduct = "",
  initialType = "",
  initialStone = "",
}: QuoteRequestFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");

  const [product, setProduct] = useState(initialProduct);
  const [jewelleryType, setJewelleryType] = useState(initialType);
  const [metal, setMetal] = useState("");
  const [stone, setStone] = useState(initialStone);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!fullName.trim() || !email.trim() || !whatsapp.trim()) {
      setError("Please fill your name, email, and WhatsApp number.");
      return;
    }

    if (!jewelleryType.trim() && !product.trim()) {
      setError("Please enter jewellery type or selected product.");
      return;
    }

    if (referenceFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ];

      if (!allowedTypes.includes(referenceFile.type)) {
        setError("Only JPG, PNG, WEBP, GIF, or PDF files are allowed.");
        return;
      }

      if (referenceFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5 MB.");
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("name", fullName);

      formData.append("email", email);
      formData.append("whatsapp", whatsapp);
      formData.append("country", country);

      formData.append("product", product);
      formData.append("selectedProduct", product);

      formData.append("jewelleryType", jewelleryType);
      formData.append("type", jewelleryType);

      formData.append("metal", metal);
      formData.append("stone", stone);
      formData.append("budget", budget);
      formData.append("timeline", timeline);
      formData.append("message", message);
      formData.append("details", message);

      if (referenceFile) {
        formData.append("referenceImage", referenceFile);
        formData.append("file", referenceFile);
      }

      const response = await fetch("/api/quote-request", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to submit quote request.");
      }

      const reference =
        result.reference ||
        result.quote?.reference ||
        result.quoteRequest?.reference ||
        "";

      setSuccess(
        reference
          ? `Quote request submitted successfully. Reference: ${reference}`
          : "Quote request submitted successfully."
      );

      setFullName("");
      setEmail("");
      setWhatsapp("");
      setCountry("");
      setProduct(initialProduct);
      setJewelleryType(initialType);
      setMetal("");
      setStone(initialStone);
      setBudget("");
      setTimeline("");
      setMessage("");
      setReferenceFile(null);
      setFileInputKey((current) => current + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit quote request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
    >
      <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        Custom Quote
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
        Request Custom Jewellery Quote
      </h2>

      <p className="mt-3 leading-7 text-neutral-600">
        Share your jewellery idea, metal, gemstone, budget, and reference image.
        We will review your request and send a custom quotation.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field label="Full Name *">
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your full name"
            className="quote-input"
          />
        </Field>

        <Field label="Email *">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="quote-input"
          />
        </Field>

        <Field label="WhatsApp *">
          <input
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="+92 300 0000000"
            className="quote-input"
          />
        </Field>

        <Field label="Country">
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Pakistan"
            className="quote-input"
          />
        </Field>

        <Field label="Selected Product">
          <input
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            placeholder="Product name or slug"
            className="quote-input"
          />
        </Field>

        <Field label="Jewellery Type *">
          <input
            value={jewelleryType}
            onChange={(event) => setJewelleryType(event.target.value)}
            placeholder="Ring, necklace, bracelet, earrings..."
            className="quote-input"
          />
        </Field>

        <Field label="Metal">
          <input
            value={metal}
            onChange={(event) => setMetal(event.target.value)}
            placeholder="18K Gold, White Gold, Platinum..."
            className="quote-input"
          />
        </Field>

        <Field label="Stone / Gemstone">
          <input
            value={stone}
            onChange={(event) => setStone(event.target.value)}
            placeholder="Diamond, Emerald, Ruby..."
            className="quote-input"
          />
        </Field>

        <Field label="Budget">
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Example: $500 - $1500"
            className="quote-input"
          />
        </Field>

        <Field label="Timeline">
          <input
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            placeholder="Example: 2-4 weeks"
            className="quote-input"
          />
        </Field>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Reference Image / PDF
        </span>

        <input
          key={fileInputKey}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          onChange={(event) => setReferenceFile(event.target.files?.[0] || null)}
          className="quote-input file:mr-4 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#a77a25]"
        />

        <p className="mt-2 text-xs text-neutral-500">
          Accepted: JPG, PNG, WEBP, GIF, PDF. Max size: 5 MB.
        </p>
      </label>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Design Details
        </span>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          placeholder="Describe your custom jewellery idea, size, stone preference, engraving, or any special request."
          className="quote-input"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Quote Request"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
        {label}
      </span>

      {children}
    </label>
  );
}