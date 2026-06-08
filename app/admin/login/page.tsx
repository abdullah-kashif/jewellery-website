import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login | LUXORA Jewellery",
  description: "Login to LUXORA admin panel.",
};

export default function AdminLoginPage() {
  return (
    <main className="bg-[#fbf7ef] px-4 py-16">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}