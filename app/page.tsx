import Link from "next/link";
import {
  categories,
  featuredProducts,
  gemstones,
  reviews,
  trustPoints,
} from "@/lib/site-data";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8a651d55,transparent_35%),linear-gradient(120deg,#0a0a0a,#1f1a12)]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#d6b46a] uppercase">
              Custom Fine Jewellery
            </p>

            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-tight md:text-7xl">
              Certified Gemstones, Crafted For You.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
              Discover ready-made jewellery, custom luxury designs, diamonds,
              and certified gemstones delivered worldwide.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-neutral-950 uppercase transition hover:bg-white"
              >
                Shop Collection
              </Link>

              <Link
                href="/custom-order"
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
              >
                Start Custom Order
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="flex h-[460px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#f7ead0] via-white to-[#caa24d] text-center text-neutral-950">
              <div>
                <p className="text-sm tracking-[0.35em] uppercase">
                  Luxury Jewellery
                </p>
                <p className="mt-4 text-5xl">◆</p>
                <p className="mt-4 text-lg font-medium">
                  Replace with hero jewellery image later
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eadfca] bg-[#fbf7ef]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3 lg:grid-cols-6">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-center text-xs font-semibold tracking-[0.14em] text-neutral-700 uppercase"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbf7ef] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Browse Jewellery
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              Shop By Category
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group overflow-hidden rounded-3xl border border-[#eadfca] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff8ec] to-[#d9bc76] text-center text-sm font-medium text-neutral-800">
                  {category.imageText}
                </div>
                <h3 className="mt-4 text-center text-sm font-semibold tracking-[0.18em] uppercase text-neutral-900 group-hover:text-[#a77a25]">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
                Featured Products
              </p>
              <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
                Our Jewellery Collection
              </h2>
            </div>

            <Link
              href="/shop"
              className="text-sm font-semibold tracking-[0.18em] text-[#a77a25] uppercase hover:text-neutral-950"
            >
              View All Products →
            </Link>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-4"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#dcc27c] text-center text-neutral-800">
                    Jewellery Image
                  </div>
                </Link>

                <div className="mt-5">
                  <p className="text-xs tracking-[0.2em] text-[#a77a25] uppercase">
                    {product.category}
                  </p>

                  <Link href={`/product/${product.slug}`}>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-950 hover:text-[#a77a25]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-3 font-medium">
                    {product.quoteRequired
                      ? `Estimated from $${product.estimatedPriceFrom}`
                      : `$${product.price}`}
                  </p>

                  <div className="mt-5 flex gap-3">
                    {product.quoteRequired ? (
                      <Link
                        href={`/custom-order?product=${product.slug}`}
                        className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
                      >
                        Request Quote
                      </Link>
                    ) : (
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 rounded-full bg-neutral-950 px-4 py-3 text-center text-xs font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
                      >
                        View Product
                      </Link>
                    )}

                    <Link
                      href="/wishlist"
                      className="rounded-full border border-[#d6b46a] px-4 py-3 text-xs font-semibold text-[#a77a25]"
                    >
                      ♡
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2eadc] px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Custom Jewellery
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-950">
              Create Your Dream Jewellery
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-700">
              Share your idea, choose gold karat and gemstones, receive a
              quotation, pay deposit, and we craft your jewellery for worldwide
              delivery.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Share Your Idea", "Get A Quote", "Pay Deposit", "Crafted For You"].map(
                (step, index) => (
                  <div key={step} className="rounded-2xl bg-white p-5">
                    <p className="text-sm font-semibold text-[#a77a25]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 font-semibold">{step}</h3>
                  </div>
                )
              )}
            </div>

            <Link
              href="/custom-order"
              className="mt-8 inline-block rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950"
            >
              Start Custom Order
            </Link>
          </div>

          <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] bg-gradient-to-br from-neutral-950 to-[#a77a25] p-8 text-center text-white">
            <div>
              <p className="text-6xl">◇</p>
              <h3 className="mt-5 text-3xl font-semibold">Made Only For You</h3>
              <p className="mt-4 text-neutral-200">
                Final price confirmed after gold, diamond, and gemstone rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Certified Stones
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Gemstones</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gemstones.map((stone) => (
              <Link
                key={stone.name}
                href={stone.href}
                className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-6 text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white to-[#d6b46a] text-4xl">
                  ◆
                </div>
                <h3 className="mt-5 text-xl font-semibold">{stone.name}</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Certified gemstone collection
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7ef] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm tracking-[0.3em] text-[#a77a25] uppercase">
              Reviews
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              Trusted By Worldwide Customers
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-3xl bg-white p-7 shadow-sm">
                <p className="text-[#d6b46a]">★★★★★</p>
                <p className="mt-4 leading-7 text-neutral-700">
                  “{review.review}”
                </p>
                <div className="mt-6">
                  <h3 className="font-semibold">{review.name}</h3>
                  <p className="text-sm text-neutral-500">{review.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}