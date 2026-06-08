import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import {
  getAllowedAdminSections,
  roleLabels,
} from "@/lib/admin/permissions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await requireCurrentAdminUser();
  const allowedSections = getAllowedAdminSections(adminUser);

  return (
    <div className="min-h-screen bg-[#fbf7ef] text-neutral-950">
      <div className="flex min-h-screen">
        <AdminSidebar
          adminUser={adminUser}
          roleLabel={roleLabels[adminUser.role]}
          sections={allowedSections}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}