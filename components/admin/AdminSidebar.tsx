"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import type { AdminUser } from "@/lib/admin/permissions";

type SidebarSection = {
  title: string;
  description: string;
  href: string;
};

type AdminSidebarProps = {
  adminUser: AdminUser;
  roleLabel: string;
  sections: SidebarSection[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  adminUser,
  roleLabel,
  sections,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const initials = adminUser.full_name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dashboardItem = {
    title: "Dashboard",
    description: "Admin home overview",
    href: "/admin",
  };

  const allItems = [dashboardItem, ...sections];

  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-[304px] shrink-0 flex-col border-r border-[#eadfca] bg-white">
      <div className="border-b border-[#eadfca] px-6 py-6">
        <Link href="/admin" className="group block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold tracking-[0.12em] text-white">
              LX
            </div>

            <div>
              <div className="text-2xl font-semibold tracking-[0.18em] text-neutral-950">
                LUXORA
              </div>
              <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-[#a77a25] uppercase">
                Admin Panel
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="border-b border-[#eadfca] px-5 py-5">
        <div className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold tracking-[0.08em] text-[#a77a25] shadow-sm">
              {initials || "AD"}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#a77a25] uppercase">
                Signed in
              </p>

              <h2 className="mt-1 truncate text-base font-semibold text-neutral-950">
                {adminUser.full_name}
              </h2>

              <p className="mt-1 break-all text-xs leading-5 text-neutral-600">
                {adminUser.email}
              </p>
            </div>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-neutral-950 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
            {roleLabel}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <p className="px-2 text-[11px] font-semibold tracking-[0.24em] text-[#a77a25] uppercase">
          Navigation
        </p>

        <nav className="mt-4 space-y-1.5">
          {allItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "group block rounded-2xl border border-[#eadfca] bg-[#fbf7ef] px-4 py-3 text-neutral-950 shadow-sm transition"
                    : "group block rounded-2xl border border-transparent px-4 py-3 text-neutral-800 transition hover:border-[#eadfca] hover:bg-[#fbf7ef]"
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      active
                        ? "h-7 w-1.5 shrink-0 rounded-full bg-[#a77a25]"
                        : "h-7 w-1.5 shrink-0 rounded-full bg-[#d6b46a]/70 group-hover:bg-[#a77a25]"
                    }
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p
                      className={
                        active
                          ? "mt-1 line-clamp-2 text-xs leading-5 text-neutral-600"
                          : "mt-1 line-clamp-2 text-xs leading-5 text-neutral-500"
                      }
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#eadfca] bg-white px-5 py-5">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
