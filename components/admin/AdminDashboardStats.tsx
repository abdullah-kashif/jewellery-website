"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  productsCount: number;
  quotesCount: number;
  messagesCount: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  paidRevenue: number;
  pendingRevenue: number;
};

type RecentOrder = {
  id: string;
  reference?: string | null;
  order_number?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  email?: string | null;
  status?: string | null;
  payment_status?: string | null;
  total?: number | null;
  total_amount?: number | null;
  created_at: string;
};

type DashboardResponse = {
  ok: boolean;
  error?: string;
  stats?: DashboardStats;
  recentOrders?: RecentOrder[];
};

const emptyStats: DashboardStats = {
  productsCount: 0,
  quotesCount: 0,
  messagesCount: 0,
  totalOrders: 0,
  pendingOrders: 0,
  processingOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  paidRevenue: 0,
  pendingRevenue: 0,
};

function formatPrice(value: number) {
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

function getOrderTotal(order: RecentOrder) {
  return Number(order.total ?? order.total_amount ?? 0);
}

export function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      const result = (await response.json()) as DashboardResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load dashboard stats.");
      }

      setStats(result.stats || emptyStats);
      setRecentOrders(result.recentOrders || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load dashboard stats."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-950">
            Store Overview
          </h2>

          <p className="mt-2 text-neutral-600">
            Live stats from Supabase orders, products, quotes, and messages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
        >
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 text-center text-neutral-600 shadow-sm">
          Loading dashboard stats...
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Products"
              value={String(stats.productsCount)}
              href="/admin/products"
            />

            <StatCard
              title="Orders"
              value={String(stats.totalOrders)}
              href="/admin/orders"
            />

            <StatCard
              title="Pending Orders"
              value={String(stats.pendingOrders)}
              href="/admin/orders"
            />

            <StatCard
              title="Paid Revenue"
              value={formatPrice(stats.paidRevenue)}
              href="/admin/orders"
            />

            <StatCard
              title="Processing"
              value={String(stats.processingOrders)}
              href="/admin/orders"
            />

            <StatCard
              title="Shipped"
              value={String(stats.shippedOrders)}
              href="/admin/orders"
            />

            <StatCard
              title="Quote Requests"
              value={String(stats.quotesCount)}
              href="/admin/quotes"
            />

            <StatCard
              title="Messages"
              value={String(stats.messagesCount)}
              href="/admin/messages"
            />
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-semibold text-neutral-950">
                  Recent Orders
                </h2>

                <p className="mt-2 text-neutral-600">
                  Latest customer checkout orders.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="rounded-full border border-[#d6b46a] px-6 py-3 text-sm font-semibold text-[#a77a25] hover:bg-[#d6b46a] hover:text-neutral-950"
              >
                View All Orders
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-[#fbf7ef] p-6 text-center text-neutral-600">
                No recent orders found.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-4 rounded-3xl bg-[#fbf7ef] p-5 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                        {order.reference || order.order_number}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                        {order.customer_name || "Customer Order"}
                      </h3>

                      <p className="mt-1 text-sm text-neutral-600">
                        {order.customer_email || order.email || "No email"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                          Order: {prettyStatus(order.status)}
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                          Payment: {prettyStatus(order.payment_status)}
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 font-semibold text-neutral-700">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <p className="text-2xl font-semibold text-neutral-950">
                        {formatPrice(getOrderTotal(order))}
                      </p>

                      <Link
                        href="/admin/orders"
                        className="text-sm font-semibold tracking-[0.16em] text-[#a77a25] uppercase"
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
        {title}
      </p>

      <p className="mt-4 text-4xl font-semibold text-neutral-950">{value}</p>

      <span className="mt-5 inline-block text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">
        Open →
      </span>
    </Link>
  );
}