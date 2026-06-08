import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Shipping Policy | LUXORA Jewellery",
  description:
    "Read LUXORA shipping policy for ready-made jewellery, custom jewellery, gemstones, and worldwide delivery.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      label="Shipping"
      title="Shipping Policy"
      description="Learn how LUXORA handles shipping, delivery timelines, international orders, tracking, customs, and insurance."
      lastUpdated="May 2026"
      sections={[
        {
          title: "Shipping Availability",
          points: [
            "LUXORA is designed to support worldwide customers.",
            "Shipping availability may depend on destination country, courier service, jewellery value, and customs rules.",
            "For high-value jewellery, shipping method may be confirmed manually before dispatch.",
          ],
        },
        {
          title: "Processing Time",
          points: [
            "Ready-made jewellery may require inspection, packaging, and confirmation before shipping.",
            "Made-to-order and custom jewellery will only enter production after quote approval and deposit confirmation.",
            "Custom jewellery production time depends on design complexity, gold work, gemstone sourcing, and finishing.",
          ],
        },
        {
          title: "Estimated Delivery",
          points: [
            "Ready-made products may take approximately 7 to 18 business days depending on destination.",
            "Custom jewellery may take approximately 2 to 8 weeks after deposit confirmation.",
            "Gemstone sourcing or certification may increase the timeline.",
          ],
        },
        {
          title: "Shipping Charges",
          points: [
            "Shipping charges may depend on destination country, package value, insurance, courier, and delivery method.",
            "Checkout may show an estimated shipping amount.",
            "Final shipping cost may be confirmed manually for international or high-value orders.",
          ],
        },
        {
          title: "Customs, Duties, and Taxes",
          points: [
            "International customers may be responsible for customs duties, import taxes, VAT, or local charges.",
            "These charges are usually decided by the destination country and are not controlled by LUXORA.",
            "Customers should check local import rules before placing high-value jewellery orders.",
          ],
        },
        {
          title: "Tracking and Insurance",
          points: [
            "Tracking details will be shared when available after dispatch.",
            "Insurance may be recommended or required for high-value jewellery shipments.",
            "Delivery delays caused by customs, courier issues, incorrect address, or local restrictions are outside direct control of LUXORA.",
          ],
        },
      ]}
    />
  );
}