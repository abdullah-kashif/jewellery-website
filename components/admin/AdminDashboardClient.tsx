"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  orders: number;
  quotes: number;
  messages: number;
  totalSales: number;
};

const ORDERS_KEY = "luxora-orders";
const QUOTES_KEY = "luxora-quote-requests";
const MESSAGES_KEY = "luxora-contact-messages";

function readStorage<T>(key: string): T[] {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    quotes: 0,
    messages: 0,
    totalSales: 0,
  });

  useEffect(() => {
    const orders = readStorage<{ total: number }>(ORDERS_KEY);
    const quotes = readStorage(QUOTES_KEY);
    const messages = readStorage(MESSAGES_KEY);

    setStats({
      orders: orders.length,
      quotes: quotes.length,
      messages: messages.length,
      totalSales: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={String(stats.orders)} />
        <StatCard title="Quote Requests" value={String(stats.quotes)} />
        <StatCard title="Messages" value={String(stats.messages)} />
        <StatCard title="Total Sales" value={formatPrice(stats.totalSales)} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminLinkCard
          title="Manage Orders"
          text="View checkout orders, customer details, order items, and update order status."
          href="/admin/orders"
        />

        <AdminLinkCard
          title="Manage Quotes"
          text="View custom jewellery quote requests and update quote status."
          href="/admin/quotes"
        />

        <AdminLinkCard
          title="Contact Messages"
          text="View customer support messages from the contact form."
          href="/admin/messages"
        />
      </div>

      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-semibold text-neutral-950">
          Admin Note
        </h2>
        <p className="mt-3 leading-7 text-neutral-600">
          This admin dashboard reads data from browser localStorage. It is good
          for development and testing. For real ecommerce launch, we will connect
          database, secure login, server APIs, payment gateway, and protected
          admin routes.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        {title}
      </p>
      <p className="mt-3 text-3xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

function AdminLinkCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-[#eadfca] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf7ef] text-2xl text-[#a77a25]">
        ◆
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-neutral-950">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-neutral-600">{text}</p>
      <p className="mt-5 text-sm font-semibold text-[#a77a25]">
        Open Section →
      </p>
    </Link>
  );
}