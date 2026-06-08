"use client";

import { FormEvent, useState } from "react";

type ContactFormProps = {
  initialProduct?: string;
  initialOrder?: string;
};

export function ContactForm({
  initialProduct = "",
  initialOrder = "",
}: ContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [subject, setSubject] = useState("");
  const [product, setProduct] = useState(initialProduct);
  const [orderReference, setOrderReference] = useState(initialOrder);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      setError("Please fill your name, email, subject, and message.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          subject,
          product,
          orderNumber: orderReference,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSuccess("Your message has been sent successfully.");

      setFullName("");
      setEmail("");
      setWhatsapp("");
      setSubject("");
      setProduct(initialProduct);
      setOrderReference(initialOrder);
      setMessage("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send message."
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
        Contact Form
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
        Send Us A Message
      </h2>

      <p className="mt-3 leading-7 text-neutral-600">
        Share your question, order reference, or jewellery request. Our team
        will respond as soon as possible.
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
            className="contact-input"
          />
        </Field>

        <Field label="Email *">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="contact-input"
          />
        </Field>

        <Field label="WhatsApp">
          <input
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="+92 300 0000000"
            className="contact-input"
          />
        </Field>

        <Field label="Subject *">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Custom jewellery / order / support"
            className="contact-input"
          />
        </Field>

        <Field label="Product">
          <input
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            placeholder="Product name or slug"
            className="contact-input"
          />
        </Field>

        <Field label="Order Reference">
          <input
            value={orderReference}
            onChange={(event) => setOrderReference(event.target.value)}
            placeholder="Example: LXO-123456"
            className="contact-input"
          />
        </Field>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Message *
        </span>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          placeholder="Write your message here..."
          className="contact-input"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
        {label}
      </span>

      {children}
    </label>
  );
}
