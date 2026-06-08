import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Return Policy | LUXORA Jewellery",
  description:
    "Read LUXORA return policy for ready-made jewellery, custom jewellery, gemstones, and international orders.",
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      label="Returns"
      title="Return Policy"
      description="Understand when jewellery may be eligible for return and which products are usually non-returnable."
      lastUpdated="May 2026"
      sections={[
        {
          title: "Return Eligibility",
          points: [
            "Ready-made jewellery may be eligible for return if it is unused, undamaged, and in original packaging.",
            "Return eligibility depends on product type, condition, hygiene standards, and order confirmation.",
            "Customers should contact LUXORA before sending any item back.",
          ],
        },
        {
          title: "Non-Returnable Items",
          points: [
            "Custom jewellery is usually non-returnable once production has started.",
            "Made-to-order jewellery is usually non-returnable because it is created according to customer requirements.",
            "Personalized items, engraved products, name pendants, resized items, and special-order gemstones may not be returnable.",
          ],
        },
        {
          title: "Return Request Timeline",
          points: [
            "Customers should contact support as soon as possible after receiving the item if there is an issue.",
            "A return request may require order number, photos, packaging details, and reason for return.",
            "LUXORA may review the request before approving any return.",
          ],
        },
        {
          title: "Condition of Returned Items",
          points: [
            "Returned items must be unused, undamaged, unworn, and in original condition.",
            "Original box, certificate, invoice, tags, and packaging should be included where applicable.",
            "Items showing wear, damage, alteration, missing certificate, or missing packaging may be refused.",
          ],
        },
        {
          title: "Return Shipping",
          points: [
            "Return shipping cost may be the responsibility of the customer unless the issue was caused by LUXORA.",
            "High-value returns should use tracked and insured shipping.",
            "LUXORA is not responsible for return packages lost or damaged during transit if the customer selected unsafe shipping.",
          ],
        },
      ]}
    />
  );
}