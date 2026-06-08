import Link from "next/link";
import { AdminPaymentConfirmationsClient } from "@/components/admin/AdminPaymentConfirmationsClient";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Confirmations | LUXORA Admin",
  description: "Review and verify customer payment confirmations.",
};

export default async function AdminPaymentsPage() {
  const adminUser = await requireCurrentAdminUser();
  const canManagePayments = hasPermission(adminUser, "can_manage_payments");

  if (!canManagePayments) {
    return (
      <main className="bg-[#fbf7ef] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
          <h1 className="text-4xl font-semibold text-neutral-950">
            Access Denied
          </h1>

          <p className="mt-4 leading-7 text-neutral-600">
            You do not have permission to manage payment confirmations.
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
      <section className="border-b border-[#eadfca] bg-neutral-950 px-4 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/admin"
            className="text-sm font-semibold tracking-[0.18em] text-[#d6b46a] uppercase hover:text-white"
          >
            ← Back To Admin
          </Link>

          <p className="mt-8 text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
            Luxora Admin
          </p>

          <h1 className="mt-4 text-5xl font-semibold">
            Payment Confirmations
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-300">
            Verify customer bank transfer proofs and update order payment
            status.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <AdminPaymentConfirmationsClient />
      </section>
    </main>
  );
}