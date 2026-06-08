import Link from "next/link";
import type { Product } from "@/lib/site-data";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { ProductImageBox } from "@/components/ui/ProductImageBox";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const productHref = `/product/${product.slug}`;
  const quoteHref = `/custom-order?product=${product.slug}`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#eadfca] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={productHref}>
        <ProductImageBox
          slug={product.slug}
          name={product.name}
          className="h-64"
        />
      </Link>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs tracking-[0.2em] text-[#a77a25] uppercase">
            {product.category.replace("-", " ")}
          </p>

          <span className="rounded-full bg-[#fbf7ef] px-3 py-1 text-[11px] font-medium text-neutral-700">
            {product.stockStatus}
          </span>
        </div>

        <Link href={productHref}>
          <h3 className="mt-3 text-lg font-semibold text-neutral-950 transition group-hover:text-[#a77a25]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
          {product.shortDescription}
        </p>

        <div className="mt-4">
          {product.quoteRequired ? (
            <div>
              <p className="text-lg font-semibold text-neutral-950">
                Estimated from {formatPrice(product.estimatedPriceFrom || 0)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Final price confirmed after quotation.
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-neutral-950">
              {formatPrice(product.price || 0)}
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          {product.quoteRequired ? (
            <Link
              href={quoteHref}
              className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
            >
              Request Quote
            </Link>
          ) : (
            <AddToCartButton
              product={product}
              className="w-full rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
            />
          )}

          <WishlistButton
            product={product}
            className="rounded-full border border-[#d6b46a] px-4 py-3 text-xs font-semibold text-[#a77a25] transition hover:bg-[#d6b46a] hover:text-neutral-950"
            activeClassName="bg-[#d6b46a] text-neutral-950"
          />
        </div>
      </div>
    </article>
  );
}