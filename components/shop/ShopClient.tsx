"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getKnownProductImage } from "@/lib/product-images";

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  product_type?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  short_description?: string | null;
  description?: string | null;
  status?: string | null;
  stock_status?: string | null;
  image_url?: string | null;
  image?: string | null;
  images?: string[] | string | null;
  metal?: string | null;
  stone?: string | null;
  created_at?: string | null;
};

type ShopClientProps = {
  products: ShopProduct[];
  initialCategory?: string;
  initialSort?: string;
};

type SortMode = "newest" | "price-low-high" | "price-high-low";

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function normalizeValue(value: unknown) {
  return cleanText(value).toLowerCase().replaceAll("_", "-");
}

function toTitle(value: unknown) {
  const text = cleanText(value).replaceAll("-", " ").replaceAll("_", " ");

  if (!text) {
    return "";
  }

  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getProductCategory(product: ShopProduct) {
  return cleanText(product.category || product.product_type || "Uncategorized");
}

function getProductPrice(product: ShopProduct) {
  const rawPrice = product.sale_price ?? product.price ?? 0;

  if (typeof rawPrice === "number") {
    return rawPrice;
  }

  const parsed = Number(String(rawPrice).replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPrice(product: ShopProduct) {
  const price = getProductPrice(product);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductDescription(product: ShopProduct) {
  return (
    cleanText(product.short_description) ||
    cleanText(product.description) ||
    "Luxury jewellery piece crafted for timeless elegance."
  );
}

function getStockLabel(product: ShopProduct) {
  const value = normalizeValue(product.stock_status || product.status);

  if (value.includes("out")) {
    return "Out Of Stock";
  }

  if (value.includes("made") || value.includes("custom")) {
    return "Made To Order";
  }

  if (value.includes("draft")) {
    return "Draft";
  }

  return "In Stock";
}

function getImageUrl(product: ShopProduct) {
  if (product.image_url) {
    return product.image_url;
  }

  if (product.image) {
    return product.image;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  if (typeof product.images === "string" && product.images.trim()) {
    try {
      const parsed = JSON.parse(product.images);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch {
      return product.images;
    }
  }

  return getKnownProductImage(product.slug) || "";
}

export function ShopClient({
  products,
  initialCategory = "",
  initialSort = "newest",
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortMode, setSortMode] = useState<SortMode>(
    initialSort === "price-low-high" || initialSort === "price-high-low"
      ? initialSort
      : "newest"
  );

  function updateFilters(nextCategory: string, nextSort: SortMode) {
    setSelectedCategory(nextCategory);
    setSortMode(nextSort);

    const params = new URLSearchParams();

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    if (nextSort !== "newest") {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const categories = useMemo(() => {
    const map = new Map<string, string>();

    products.forEach((product) => {
      const rawCategory = getProductCategory(product);
      const key = normalizeValue(rawCategory);

      if (!key || key === "uncategorized") {
        return;
      }

      if (!map.has(key)) {
        map.set(key, toTitle(rawCategory));
      }
    });

    return Array.from(map.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const visibleProducts = useMemo(() => {
    let nextProducts = [...products];

    if (selectedCategory) {
      const activeCategory = normalizeValue(selectedCategory);

      nextProducts = nextProducts.filter(
        (product) => normalizeValue(getProductCategory(product)) === activeCategory
      );
    }

    if (sortMode === "price-low-high") {
      nextProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    }

    if (sortMode === "price-high-low") {
      nextProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    if (sortMode === "newest") {
      nextProducts.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    }

    return nextProducts;
  }, [products, selectedCategory, sortMode]);

  const filterButtonClass = (active: boolean) =>
    active
      ? "w-full rounded-full bg-neutral-950 px-4 py-3 text-left text-sm font-semibold text-white transition"
      : "w-full rounded-full bg-[#f5efe3] px-4 py-3 text-left text-sm text-neutral-800 transition hover:bg-[#eadfca]";

  const sortButtonClass = (active: boolean) =>
    active
      ? "rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition"
      : "rounded-full border border-[#eadfca] bg-white px-5 py-3 text-sm text-neutral-950 transition hover:bg-[#f5efe3]";

  return (
    <section className="bg-[#fbf7ef] px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold tracking-[0.28em] uppercase">
              Filters
            </h2>

            <button
              type="button"
              onClick={() => updateFilters("", "newest")}
              className="text-sm font-medium text-[#a77a25] hover:text-neutral-950"
            >
              Clear
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold tracking-[0.28em] text-[#a77a25] uppercase">
              Categories
            </h3>

            <div className="mt-4 space-y-3">
              {categories.length === 0 && (
                <p className="text-sm text-neutral-500">No categories found.</p>
              )}

              {categories.map((category) => {
                const active =
                  normalizeValue(selectedCategory) === normalizeValue(category.key);

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() =>
                      updateFilters(active ? "" : category.key, sortMode)
                    }
                    className={filterButtonClass(active)}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-[#f8f1e6] p-5">
            <h3 className="font-semibold text-neutral-950">
              Need Custom Design?
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Share your design idea and our team will send you a custom quote.
            </p>

            <Link
              href="/custom-order"
              className="mt-4 inline-block text-sm font-semibold text-[#a77a25] hover:text-neutral-950"
            >
              Request Quote →
            </Link>
          </div>
        </aside>

        <div>
          <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:flex-row md:items-center">
            <p className="text-sm text-neutral-700">
              Showing{" "}
              <span className="font-semibold text-neutral-950">
                {visibleProducts.length}
              </span>{" "}
              products
              {selectedCategory ? (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-[#a77a25]">
                    {toTitle(selectedCategory)}
                  </span>
                </>
              ) : null}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => updateFilters(selectedCategory, "newest")}
                className={sortButtonClass(sortMode === "newest")}
              >
                Newest
              </button>

              <button
                type="button"
                onClick={() =>
                  updateFilters(selectedCategory, "price-low-high")
                }
                className={sortButtonClass(sortMode === "price-low-high")}
              >
                Price Low to High
              </button>

              <button
                type="button"
                onClick={() =>
                  updateFilters(selectedCategory, "price-high-low")
                }
                className={sortButtonClass(sortMode === "price-high-low")}
              >
                Price High to Low
              </button>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-sm">
              <h3 className="text-3xl font-semibold text-neutral-950">
                No products found
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">
                Try clearing filters or choose another category.
              </p>

              <button
                type="button"
                onClick={() => updateFilters("", "newest")}
                className="mt-6 rounded-full bg-neutral-950 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const imageUrl = getImageUrl(product);
                const productHref = `/product/${encodeURIComponent(
                  product.slug || product.id
                )}`;

                return (
                  <article
                    key={product.id}
                    className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={productHref} className="block">
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-white via-[#fbf7ef] to-[#eadfca]">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto mb-4 h-8 w-8 rotate-45 bg-neutral-950" />
                            <p className="px-4 text-sm text-neutral-700">
                              {product.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="line-clamp-1 text-xs font-semibold tracking-[0.25em] text-[#a77a25] uppercase">
                        {toTitle(getProductCategory(product))}
                      </p>

                      <span className="shrink-0 rounded-full bg-[#fbf7ef] px-3 py-1 text-xs text-neutral-700">
                        {getStockLabel(product)}
                      </span>
                    </div>

                    <Link href={productHref}>
                      <h3 className="mt-3 line-clamp-2 min-h-[4rem] text-2xl font-semibold leading-8 text-neutral-950 hover:text-[#a77a25]">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
                      {getProductDescription(product)}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                      <p className="text-xl font-semibold text-neutral-950">
                        {formatPrice(product)}
                      </p>

                      <Link
                        href={productHref}
                        className="rounded-full bg-neutral-950 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#a77a25]"
                      >
                        View
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
