"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SupabaseContactMessage = {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  subject: string;
  product: string | null;
  order_number: string | null;
  message: string;
  created_at: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function AdminMessagesClient() {
  const [messages, setMessages] = useState<SupabaseContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  async function loadMessages() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/messages", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load messages.");
      }

      setMessages(result.messages || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function deleteMessage(id: string) {
    setActionLoadingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to delete message.");
      }

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete message."
      );
    } finally {
      setActionLoadingId("");
    }
  }

  const filteredMessages = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return messages;
    }

    return messages.filter((message) => {
      return (
        message.reference.toLowerCase().includes(keyword) ||
        message.full_name.toLowerCase().includes(keyword) ||
        message.email.toLowerCase().includes(keyword) ||
        message.subject.toLowerCase().includes(keyword) ||
        message.message.toLowerCase().includes(keyword)
      );
    });
  }, [messages, search]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-neutral-950">
          Loading messages...
        </h2>
        <p className="mt-3 text-neutral-600">
          Fetching contact messages from Supabase.
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title="No contact messages found"
        text="Submit a contact form message and it will appear here from Supabase."
        href="/contact"
        label="Create Test Message"
      />
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search message, name, email, subject..."
            className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25] md:max-w-md"
          />

          <button
            type="button"
            onClick={loadMessages}
            className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredMessages.map((message) => (
        <div
          key={message.id}
          className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-[#eadfca] pb-5 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
                {message.reference}
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                {message.full_name}
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                {formatDate(message.created_at)}
              </p>
            </div>

            <button
              type="button"
              disabled={actionLoadingId === message.id}
              onClick={() => deleteMessage(message.id)}
              className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionLoadingId === message.id ? "Deleting..." : "Delete"}
            </button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Info title="Email" value={message.email} />
            <Info title="WhatsApp" value={message.whatsapp || "Not provided"} />
            <Info title="Subject" value={message.subject} />
            <Info title="Product" value={message.product || "Not provided"} />
            <Info
              title="Order Number"
              value={message.order_number || "Not provided"}
            />
          </div>

          <div className="mt-5 rounded-3xl bg-[#fbf7ef] p-5">
            <h3 className="font-semibold text-neutral-950">Message</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              {message.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf7ef] p-4">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
        {title}
      </p>
      <p className="mt-2 text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
      <h2 className="text-3xl font-semibold text-neutral-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">{text}</p>
      <Link
        href={href}
        className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
      >
        {label}
      </Link>
    </div>
  );
}