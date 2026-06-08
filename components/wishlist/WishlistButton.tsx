"use client";

import { useState } from "react";
import type { Product } from "@/lib/site-data";
import { useWishlist } from "@/components/providers/WishlistProvider";

type WishlistButtonProps = {
  product: Product;
  className?: string;
  activeClassName?: string;
  label?: string;
  showMessage?: boolean;
};

export function WishlistButton({
  product,
  className = "",
  activeClassName = "",
  label = "♡",
  showMessage = false,
}: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [message, setMessage] = useState("");

  const active = isInWishlist(product.slug);

  function handleClick() {
    toggleWishlist(product);

    if (showMessage) {
      setMessage(active ? "Removed from wishlist" : "Added to wishlist");
      setTimeout(() => setMessage(""), 1800);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={`${className} ${active ? activeClassName : ""}`}
      >
        {active ? "♥" : label}
      </button>

      {message && (
        <p className="mt-2 text-center text-xs font-medium text-[#a77a25]">
          {message}
        </p>
      )}
    </div>
  );
}