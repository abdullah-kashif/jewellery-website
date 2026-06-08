import Link from "next/link";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { getAllowedAdminSections } from "@/lib/admin/permissions";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | LUXORA Jewellery",
  description: "Manage LUXORA jewellery website.",
};

type AdminPageProps = {
  searchParams?: Promise<{
    access?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const adminUser = await requireCurrentAdminUser();
  const allowedSections = getAllowedAdminSections(adminUser);
  const accessDenied = params?.access === "denied";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.28em] text-[#a77a25] uppercase">
          Admin Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-neutral-950">
          Welcome back, {adminUser.full_name}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
          Manage products, orders, quote requests, payment confirmations, and
          customer messages from one clean admin dashboard.
        </p>
      </section>

      {accessDenied && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          You do not have permission to open that admin section.
        </div>
      )}

      <section className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-950">
              Store Overview
            </h2>
            <p className="mt-2 text-neutral-600">
              Live stats from Supabase orders, products, quotes, and messages.
            </p>
          </div>
        </div>

        <AdminDashboardStats />
      </section>

      <section className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-neutral-950">
            Quick Access
          </h2>
          <p className="mt-2 text-neutral-600">
            Open the section you want to manage.
          </p>
        </div>

        {allowedSections.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {allowedSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-[1.75rem] border border-[#eadfca] bg-[#fbf7ef] p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#a77a25] shadow-sm">
                  ◆
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-neutral-950">
                  {section.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {section.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                  Open Section →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-[#eadfca] bg-[#fbf7ef] p-8 text-center">
            <h3 className="text-2xl font-semibold text-neutral-950">
              No permissions assigned
            </h3>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-neutral-600">
              Your admin account is active, but no sections are assigned yet.
              Please contact the super admin.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}