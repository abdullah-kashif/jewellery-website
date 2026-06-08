"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/site-data";
import { useCart } from "@/components/providers/CartProvider";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  product,
  className = "",
  label = "Add To Cart",
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");

  function handleClick() {
    if (product.quoteRequired || product.productType === "custom-quote") {
      router.push(`/custom-order?product=${product.slug}`);
      return;
    }

    const added = addToCart(product);

    if (added) {
      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 1800);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} className={className}>
        {product.quoteRequired ? "Request Quote" : label}
      </button>

      {message && (
        <p className="mt-2 text-center text-xs font-medium text-[#a77a25]">
          {message}
        </p>
      )}
    </div>
  );
}