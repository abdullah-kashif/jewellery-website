import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  formatProductPrice,
} from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product
      ? `${product.name} | LUXORA Jewellery`
      : "Product | LUXORA Jewellery",
    description:
      product?.short_description ||
      product?.description ||
      "Luxury jewellery product details.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts())
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const gallery =
    product.gallery_urls && product.gallery_urls.length > 0
      ? product.gallery_urls
      : product.image_url
        ? [product.image_url]
        : [];

  return (
    <main className="bg-[#fbf7ef]">
      <section className="border-b border-[#eadfca] bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
            Home / Product
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex aspect-square items-center justify-center rounded-[2rem] border border-[#eadfca] bg-gradient-to-br from-white via-[#fbf7ef] to-[#eadfca] p-6 shadow-sm">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto h-8 w-8 rotate-45 bg-[#a77a25]" />
                <p className="mt-6 font-semibold text-neutral-950">
                  Image coming soon
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  {product.name}
                </p>
              </div>
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="aspect-square rounded-2xl border border-[#eadfca] bg-white p-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[0.22em] text-[#a77a25] uppercase">
            {product.category || "Jewellery"}
          </p>

          <h1 className="mt-3 text-5xl font-semibold text-neutral-950">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-semibold text-neutral-950">
            {formatProductPrice(product.price)}
          </p>

          <p className="mt-5 max-w-2xl leading-8 text-neutral-600">
            {product.description ||
              product.short_description ||
              "Luxury jewellery piece crafted with premium finishing."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoRow label="Metal" value={product.metal || "Not specified"} />
            <InfoRow label="Stone" value={product.stone || "Not specified"} />
            <InfoRow label="Carat" value={product.carat || "Not specified"} />
            <InfoRow label="Color" value={product.color || "Not specified"} />
            <InfoRow
              label="Clarity"
              value={product.clarity || "Not specified"}
            />
            <InfoRow
              label="Stock"
              value={product.stock_status || "in-stock"}
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/cart?add=${product.slug}`}
              className="rounded-full bg-neutral-950 px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-[#a77a25]"
            >
              Add To Cart
            </Link>

            <Link
              href={`/custom-order?product=${product.slug}&type=${product.category || ""}`}
              className="rounded-full border border-[#a77a25] px-8 py-4 text-center text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase hover:bg-[#a77a25] hover:text-white"
            >
              Request Quote
            </Link>
          </div>

          <div className="mt-8 grid gap-3 border-t border-[#eadfca] pt-6 text-sm text-neutral-600 md:grid-cols-3">
            <p>◆ Worldwide Shipping</p>
            <p>◆ 30 Days Returns</p>
            <p>◆ Certified Jewellery</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-neutral-950">
            Product Details
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <DetailCard
              title="Pricing Note"
              text="Gold and diamond prices can change based on live market rates. Final custom pricing is confirmed by quotation."
            />
            <DetailCard
              title="Certification"
              text="Gemstones and diamonds can be supplied with certification depending on customer requirement."
            />
            <DetailCard
              title="Customisation"
              text="You can request different metal, stone, size, or finishing using the custom quote form."
            />
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="text-3xl font-semibold text-neutral-950">
            Related Products
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="rounded-[1.6rem] border border-[#eadfca] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex aspect-square items-center justify-center rounded-[1.3rem] bg-gradient-to-br from-white via-[#fbf7ef] to-[#eadfca]">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full rounded-[1.3rem] object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto h-5 w-5 rotate-45 bg-[#a77a25]" />
                      <p className="mt-4 text-sm text-neutral-600">
                        Image coming soon
                      </p>
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-neutral-950">
                  {item.name}
                </h3>

                <p className="mt-2 font-semibold text-[#a77a25]">
                  {formatProductPrice(item.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#eadfca]">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
        {label}
      </p>

      <p className="mt-2 font-semibold text-neutral-950">{value}</p>
    </div>
  );
}

function DetailCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[#fbf7ef] p-6">
      <h3 className="text-xl font-semibold text-neutral-950">{title}</h3>

      <p className="mt-3 leading-7 text-neutral-600">{text}</p>
    </div>
  );
}
