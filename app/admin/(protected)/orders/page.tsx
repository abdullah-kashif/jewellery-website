import Link from "next/link";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Orders | LUXORA Jewellery",
  description: "Manage customer jewellery orders.",
};

export default async function AdminOrdersPage() {
  const adminUser = await requireCurrentAdminUser();
  const canManageOrders = hasPermission(adminUser, "can_manage_orders");

  if (!canManageOrders) {
    return (
      <main className="bg-[#fbf7ef] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
          <h1 className="text-4xl font-semibold text-neutral-950">
            Access Denied
          </h1>

          <p className="mt-4 leading-7 text-neutral-600">
            You do not have permission to manage orders.
          </p>

          <Link
            href="/admin"
            className="mt-8 inline-block rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
          >
            Back To Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.2em] text-[#a77a25] uppercase">
            Admin / Orders
          </p>

          <h1 className="mt-4 text-5xl font-semibold text-neutral-950">
            Manage Orders
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            View customer orders, update order status, and manage payment
            status.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <AdminOrdersClient />
      </section>
    </main>
  );
}