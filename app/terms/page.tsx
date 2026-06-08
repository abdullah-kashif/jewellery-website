import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Terms & Conditions | LUXORA Jewellery",
  description:
    "Read LUXORA terms and conditions for jewellery orders, custom quotes, pricing, payments, shipping, and website use.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      label="Terms"
      title="Terms & Conditions"
      description="These terms explain the basic rules for using the LUXORA website, placing orders, requesting custom jewellery, and communicating with our team."
      lastUpdated="May 2026"
      sections={[
        {
          title: "Website Use",
          points: [
            "By using the LUXORA website, customers agree to use it for lawful shopping, quotation, contact, and order support purposes.",
            "Customers should provide accurate information when submitting orders, custom quote requests, or contact forms.",
            "LUXORA may update website content, products, pricing, and policies when needed.",
          ],
        },
        {
          title: "Product Information",
          points: [
            "Product images, colours, sizes, gemstones, and gold tones may appear different depending on screen and photography.",
            "Product descriptions are provided to help customers understand jewellery specifications.",
            "Gold weight, gemstone details, diamond grading, and certification may vary by product and final confirmed order.",
          ],
        },
        {
          title: "Pricing",
          points: [
            "Ready-made products may show fixed prices.",
            "Custom jewellery, made-to-order products, gemstones, and special requests may require quotation.",
            "Gold, diamond, and gemstone prices can change, so custom quotes may be valid for a limited time.",
          ],
        },
        {
          title: "Custom Orders",
          points: [
            "Custom jewellery starts with a customer request, design review, quotation, deposit, production, balance payment, and shipping.",
            "Production usually starts after quote approval and deposit payment.",
            "Once production starts, custom jewellery cancellation, return, or refund may be limited.",
          ],
        },
        {
          title: "Payments",
          points: [
            "Payment method may include manual invoice, bank transfer, or payment gateway when connected.",
            "High-value international orders may require manual confirmation before final payment.",
            "Orders may not be shipped until payment is confirmed.",
          ],
        },
        {
          title: "Shipping and Customs",
          points: [
            "Shipping timeline and cost may depend on item type, destination country, insurance, courier, and customs.",
            "International customers may be responsible for customs duties, taxes, VAT, or import charges.",
            "LUXORA is not responsible for delays caused by customs, courier issues, incorrect address, or local restrictions.",
          ],
        },
        {
          title: "Limitation",
          points: [
            "This website is currently being developed and some features may use localStorage or placeholder flows.",
            "Real payment, database, admin, authentication, and production security should be added before live business launch.",
            "Final legal terms should be reviewed by a qualified professional before accepting real customer orders.",
          ],
        },
      ]}
    />
  );
}