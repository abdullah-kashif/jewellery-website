import { CustomerAuthForm } from "@/components/account/CustomerAuthForm";
import { CustomerAccountDashboard } from "@/components/account/CustomerAccountDashboard";
import { getCurrentCustomer } from "@/lib/customer-profile";
import { getCurrentCustomerOrders } from "@/lib/customer-orders";
import { getCurrentCustomerQuoteRequests } from "@/lib/customer-quotes";
import { PageIntroHero } from "@/components/ui/PageIntroHero";

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
      <PageIntroHero
        eyebrow="Account"
        title="Customer Account"
        description="Login, create an account, track your jewellery orders, and manage quote requests."
        imageSrc="/images/home/custom-jewellery-workbench.jpg"
        imageAlt="Jewellery client account and custom order consultation"
      />

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
