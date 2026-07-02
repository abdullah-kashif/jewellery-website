import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeProductSlug } from "@/lib/product-slug";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function toNullableText(value: unknown) {
  const cleanValue = cleanText(value);
  return cleanValue || null;
}

function toNumberOrNull(value: unknown) {
  const cleanValue = cleanText(value);

  if (!cleanValue) {
    return null;
  }

  const numberValue = Number(cleanValue);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
}

function normalizeStockStatus(value: unknown) {
  return cleanText(value) || "In Stock";
}

function normalizeImageUrl(value: unknown) {
  const imageUrl = cleanText(value);

  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
      ? imageUrl
      : null;
  } catch {
    return null;
  }
}

function buildProductPayload(body: Record<string, unknown>) {
  return {
    name: cleanText(body.name),
    slug: normalizeProductSlug(body.slug, body.name),
    category: cleanText(body.category) || "rings",
    product_type: cleanText(body.productType || body.product_type) || "ready-made",
    price: toNumberOrNull(body.price),
    estimated_price_from: toNumberOrNull(
      body.estimatedPriceFrom || body.estimated_price_from
    ),
    image_url: normalizeImageUrl(body.imageUrl || body.image_url),
    quote_required: Boolean(body.quoteRequired ?? body.quote_required),
    metal_type: toNullableText(body.metalType || body.metal_type),
    gold_karat: toNullableText(body.goldKarat || body.gold_karat),
    gold_weight: toNullableText(body.goldWeight || body.gold_weight),
    stone_type: toNullableText(body.stoneType || body.stone_type),
    stone_weight: toNullableText(body.stoneWeight || body.stone_weight),
    diamond_carat: toNullableText(body.diamondCarat || body.diamond_carat),
    diamond_cut: toNullableText(body.diamondCut || body.diamond_cut),
    diamond_color: toNullableText(body.diamondColor || body.diamond_color),
    diamond_clarity: toNullableText(body.diamondClarity || body.diamond_clarity),
    gemstone_carat: toNullableText(body.gemstoneCarat || body.gemstone_carat),
    gemstone_shape: toNullableText(body.gemstoneShape || body.gemstone_shape),
    gemstone_origin: toNullableText(body.gemstoneOrigin || body.gemstone_origin),
    gemstone_treatment: toNullableText(
      body.gemstoneTreatment || body.gemstone_treatment
    ),
    certificate: toNullableText(body.certificate),
    stock_status: normalizeStockStatus(body.stockStatus || body.stock_status),
    short_description:
      cleanText(body.shortDescription || body.short_description) ||
      "Luxury jewellery product.",
    description:
      cleanText(body.description) ||
      "Luxury jewellery product crafted for premium customers.",
    delivery_time:
      cleanText(body.deliveryTime || body.delivery_time) ||
      "7 to 18 business days",
    return_eligible: Boolean(body.returnEligible ?? body.return_eligible ?? true),
    is_active: true,
    updated_at: new Date().toISOString(),
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = buildProductPayload(body);
    const submittedImageUrl = cleanText(body.imageUrl || body.image_url);

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!payload.name) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!payload.slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (submittedImageUrl && !payload.image_url) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product image URL must be a valid http(s) URL.",
        },
        { status: 400 }
      );
    }

    const { data: existingProduct } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", payload.slug)
      .neq("id", id)
      .maybeSingle();

    if (existingProduct) {
      return NextResponse.json(
        {
          ok: false,
          error: "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}
