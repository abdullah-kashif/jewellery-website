import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { WishlistClient } from "@/components/wishlist/WishlistClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wishlist | LUXORA Jewellery",
  description: "View your saved LUXORA jewellery items.",
};

export default function WishlistPage() {
  return (
    <WishlistProvider>
      <WishlistClient />
    </WishlistProvider>
  );
}