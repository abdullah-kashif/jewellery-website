import { PolicyPage } from "@/components/policy/PolicyPage";

export const metadata = {
  title: "Refund Policy | LUXORA Jewellery",
  description:
    "Read LUXORA refund policy for jewellery orders, custom orders, deposits, and payment confirmation.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      label="Refunds"
      title="Refund Policy"
      description="Learn how refunds are reviewed for ready-made products, custom orders, deposits, and cancelled orders."
      lastUpdated="May 2026"
      sections={[
        {
          title: "Refund Review",
          points: [
            "Refund requests are reviewed according to product type, order status, payment method, and item condition.",
            "Approved refunds may take time depending on payment provider, bank, or manual transfer process.",
            "Refund approval is not automatic and may require inspection or order review.",
          ],
        },
        {
          title: "Ready-Made Products",
          points: [
            "Ready-made products may be eligible for refund if the return is approved and the item is received in original condition.",
            "Original packaging, certificate, invoice, and accessories should be returned where applicable.",
            "Shipping, insurance, customs, or payment processing fees may not always be refundable.",
          ],
        },
        {
          title: "Custom Jewellery Deposits",
          points: [
            "Custom jewellery usually requires a deposit before production starts.",
            "Once production starts, deposits are usually non-refundable because materials, labour, design work, and gemstone sourcing may already begin.",
            "If cancellation happens before production starts, LUXORA may review whether partial refund is possible.",
          ],
        },
        {
          title: "Made-To-Order Products",
          points: [
            "Made-to-order products are usually non-refundable once confirmed and production has started.",
            "This includes bridal sets, custom rings, name pendants, special sizes, custom gemstone settings, and personalized jewellery.",
            "Final refund decision depends on production stage and approved quote terms.",
          ],
        },
        {
          title: "Damaged or Incorrect Item",
          points: [
            "If an item arrives damaged or incorrect, customers should contact support quickly with photos, video, packaging details, and order number.",
            "LUXORA will review the issue and may offer repair, replacement, return, or refund depending on the case.",
            "Items damaged after delivery due to misuse, accidents, or improper handling may not qualify for refund.",
          ],
        },
      ]}
    />
  );
}