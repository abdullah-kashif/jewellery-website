import Link from "next/link";
import type { Product } from "@/lib/site-data";
import { ProductImageBox } from "@/components/ui/ProductImageBox";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function GemstoneCard({ gemstone }: { gemstone: Product }) {
  const productHref = `/product/${gemstone.slug}`;
  const quoteHref = `/custom-order?stone=${gemstone.stoneType}`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#eadfca] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={productHref}>
        <ProductImageBox
          slug={gemstone.slug}
          name={gemstone.name}
          className="h-64"
        />
      </Link>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs tracking-[0.2em] text-[#a77a25] uppercase">
            {gemstone.stoneType}
          </p>

          <span className="rounded-full bg-[#fbf7ef] px-3 py-1 text-[11px] font-medium text-neutral-700">
            {gemstone.stockStatus}
          </span>
        </div>

        <Link href={productHref}>
          <h3 className="mt-3 text-lg font-semibold text-neutral-950 transition group-hover:text-[#a77a25]">
            {gemstone.name}
          </h3>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-[#fbf7ef] p-3">
            <p className="text-xs text-neutral-500">Carat</p>
            <p className="font-medium text-neutral-950">
              {gemstone.gemstoneCarat || gemstone.diamondCarat || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#fbf7ef] p-3">
            <p className="text-xs text-neutral-500">Shape</p>
            <p className="font-medium text-neutral-950">
              {gemstone.gemstoneShape || gemstone.diamondCut || "N/A"}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
          {gemstone.shortDescription}
        </p>

        <div className="mt-4">
          {gemstone.quoteRequired ? (
            <div>
              <p className="text-lg font-semibold text-neutral-950">
                Estimated from {formatPrice(gemstone.estimatedPriceFrom || 0)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Final price confirmed after availability.
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-neutral-950">
              {formatPrice(gemstone.price || 0)}
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          {gemstone.quoteRequired ? (
            <Link
              href={quoteHref}
              className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
            >
              Ask Availability
            </Link>
          ) : (
            <Link
              href={productHref}
              className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
            >
              View Stone
            </Link>
          )}

          <Link
            href={`/custom-order?stone=${gemstone.stoneType}`}
            className="rounded-full border border-[#d6b46a] px-4 py-3 text-xs font-semibold text-[#a77a25] transition hover:bg-[#d6b46a] hover:text-neutral-950"
          >
            Quote
          </Link>
        </div>
      </div>
    </article>
  );
}