import { CustomerAuthForm } from "@/components/account/CustomerAuthForm";
import { CustomerAccountDashboard } from "@/components/account/CustomerAccountDashboard";
import { getCurrentCustomer } from "@/lib/customer-profile";
import { getCurrentCustomerOrders } from "@/lib/customer-orders";
import { getCurrentCustomerQuoteRequests } from "@/lib/customer-quotes";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Account | LUXORA Jewellery",
  description: "Login or create your LUXORA customer account.",
};

export default async function AccountPage() {
  const { user, profile } = await getCurrentCustomer();
  const orders = user ? await getCurrentCustomerOrders() : [];
  const quoteRequests = user ? await getCurrentCustomerQuoteRequests() : [];

  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.2em] text-[#a77a25] uppercase">
            Account
          </p>

          <h1 className="mt-4 text-5xl font-semibold text-neutral-950">
            Customer Account
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
            Login, create an account, track your jewellery orders, and manage
            quote requests.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {user ? (
          <CustomerAccountDashboard
            email={user.email || ""}
            profile={profile}
            orders={orders}
            quoteRequests={quoteRequests}
          />
        ) : (
          <CustomerAuthForm />
        )}
      </section>
    </main>
  );
}