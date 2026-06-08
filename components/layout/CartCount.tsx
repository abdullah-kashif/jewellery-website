"use client";

import { useCart } from "@/components/providers/CartProvider";

export function CartCount() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <span className="ml-1 rounded-full bg-[#d6b46a] px-2 py-0.5 text-[10px] font-bold text-neutral-950">
      {count}
    </span>
  );
}