import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = String(searchParams.get("slug") || "").trim();

    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category || "Jewellery",
        price: Number(product.price || 0),
        image_url: product.image_url || null,
        stock_status: product.stock_status || "in-stock",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load product.",
      },
      { status: 500 }
    );
  }
}