import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Privacy Policy | LUXORA Jewellery",
  description:
    "Read LUXORA privacy policy explaining how customer information may be used for orders, support, and communication.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      label="Privacy"
      title="Privacy Policy"
      description="This page explains how LUXORA may collect and use customer information for orders, support, communication, and website functionality."
      lastUpdated="May 2026"
      sections={[
        {
          title: "Information We Collect",
          points: [
            "We may collect customer name, email, phone number, WhatsApp number, shipping address, billing details, order details, and custom jewellery request information.",
            "For custom jewellery, customers may provide reference images, design preferences, ring size, metal choice, gemstone preference, and budget.",
            "Website functionality may use localStorage for cart, wishlist, order tracking, and saved form details during development.",
          ],
        },
        {
          title: "How We Use Information",
          points: [
            "Customer information may be used to process orders, prepare quotations, arrange shipping, provide support, and communicate order updates.",
            "Custom order details are used to understand design requirements and provide accurate quotation.",
            "Contact form information is used to reply to customer questions and support requests.",
          ],
        },
        {
          title: "Payments",
          points: [
            "Payment information should be handled through secure payment providers, bank transfer, or manual invoice processes.",
            "This starter website currently uses placeholder payment flow and does not process real card payments yet.",
            "When a real payment gateway is added, payment data should be handled according to the gateway provider’s security rules.",
          ],
        },
        {
          title: "Sharing Information",
          points: [
            "Customer information may be shared with shipping providers, payment providers, or service partners only when needed to complete an order.",
            "We do not design this website to sell customer personal information.",
            "Legal, fraud prevention, courier, or customs requirements may require limited information sharing.",
          ],
        },
        {
          title: "Data Security",
          points: [
            "Reasonable security measures should be used to protect customer information.",
            "Customers should avoid sending sensitive payment details through normal contact forms or chat messages.",
            "Before real launch, database, authentication, payment, and admin security should be implemented properly.",
          ],
        },
        {
          title: "Customer Rights",
          points: [
            "Customers may contact LUXORA to ask about their personal information, order data, or communication preferences.",
            "Privacy rights may vary by country or region.",
            "Before worldwide launch, this policy should be reviewed according to target markets and applicable privacy laws.",
          ],
        },
      ]}
    />
  );
}