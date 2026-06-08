"use client";

import { useWishlist } from "@/components/providers/WishlistProvider";

export function WishlistCount() {
  const { getWishlistCount } = useWishlist();
  const count = getWishlistCount();

  return (
    <span className="ml-1 rounded-full bg-[#d6b46a] px-2 py-0.5 text-[10px] font-bold text-neutral-950">
      {count}
    </span>
  );
}