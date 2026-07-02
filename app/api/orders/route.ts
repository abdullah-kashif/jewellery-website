import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type CheckoutItem = {
  id?: string;
  name?: string;
  slug?: string;
  category?: string | null;
  price?: number;
  quantity?: number;
  image_url?: string | null;
};

type ProductCartRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  image_url: string | null;
  is_active: boolean | null;
  quote_required: boolean | null;
  stock_status: string | null;
};

class CheckoutValidationError extends Error {}

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function cleanNumber(value: unknown) {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function generateOrderReference() {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `LXO-${randomPart}`;
}

function normalizeCartKey(item: CheckoutItem) {
  return cleanText(item.id) || cleanText(item.slug);
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();

    const fullName = cleanText(body.fullName);
    const email = cleanText(body.email).toLowerCase();
    const whatsapp = cleanText(body.whatsapp);
    const country = cleanText(body.country);
    const address = cleanText(body.address);
    const city = cleanText(body.city);
    const state = cleanText(body.state);
    const postalCode = cleanText(body.postalCode);
    const notes = cleanText(body.notes);
    const paymentMethod = cleanText(body.paymentMethod) || "manual";

    const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];

    if (!fullName || !email || !whatsapp || !country || !address || !city) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required customer fields.",
        },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cart is empty.",
        },
        { status: 400 }
      );
    }

    const productIds = Array.from(
      new Set(items.map((item) => cleanText(item.id)).filter(Boolean))
    );
    const productSlugs = Array.from(
      new Set(items.map((item) => cleanText(item.slug)).filter(Boolean))
    );

    if (productIds.length === 0 && productSlugs.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Cart items must include valid product identifiers.",
        },
        { status: 400 }
      );
    }

    const productFilters = [
      ...productIds.map((id) => `id.eq.${id}`),
      ...productSlugs.map((slug) => `slug.eq.${slug}`),
    ];

    const { data: productRows, error: productsError } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, slug, category, price, image_url, is_active, quote_required, stock_status"
      )
      .or(productFilters.join(","));

    if (productsError) {
      return NextResponse.json(
        {
          ok: false,
          error: productsError.message,
        },
        { status: 500 }
      );
    }

    const productsById = new Map<string, ProductCartRow>();
    const productsBySlug = new Map<string, ProductCartRow>();

    ((productRows || []) as ProductCartRow[]).forEach((product) => {
      productsById.set(product.id, product);
      productsBySlug.set(product.slug, product);
    });

    const normalizedItems = items.map((item) => {
      const product =
        productsById.get(cleanText(item.id)) ||
        productsBySlug.get(cleanText(item.slug));

      if (!product) {
        throw new CheckoutValidationError(
          `Product is no longer available: ${normalizeCartKey(item)}`
        );
      }

      if (!product.is_active || product.quote_required) {
        throw new CheckoutValidationError(
          `${product.name} cannot be checked out directly.`
        );
      }

      if (product.stock_status === "out_of_stock") {
        throw new CheckoutValidationError(
          `${product.name} is currently out of stock.`
        );
      }

      const quantity = Math.max(1, Math.floor(cleanNumber(item.quantity)));
      const price = cleanNumber(product.price);

      if (price <= 0) {
        throw new CheckoutValidationError(
          `${product.name} does not have a valid checkout price.`
        );
      }

      return {
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        category: cleanText(product.category) || "Jewellery",
        price,
        quantity,
        image_url: cleanText(product.image_url) || null,
      };
    });

    const subtotal = normalizedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const reference = generateOrderReference();

    let customerProfileId: string | null = null;

    if (user) {
      const { data: existingProfile } = await supabaseAdmin
        .from("customer_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingProfile?.id) {
        customerProfileId = existingProfile.id;
        await supabaseAdmin
          .from("customer_profiles")
          .update({
            full_name: fullName,
            email,
            phone: whatsapp,
            country,
            address,
            updated_at: new Date().toISOString(),
          })
          .eq("id", customerProfileId);
      } else {
        const { data: newProfile } = await supabaseAdmin
          .from("customer_profiles")
          .insert({
            user_id: user.id,
            full_name: fullName,
            email,
            phone: whatsapp,
            country,
            address,
          })
          .select("id")
          .single();

        customerProfileId = newProfile?.id || null;
      }
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        reference,
        order_number: reference,

        customer_user_id: user?.id || null,
        customer_profile_id: customerProfileId,

        email,
        customer_email: email,
        customer_name: fullName,

        whatsapp,
        country,
        address,
        city,
        state,
        postal_code: postalCode,

        subtotal,
        shipping,
        total,

        payment_method: paymentMethod,
        payment_status: "pending",
        status: "pending",
        notes,
      })
      .select("*")
      .single();

    if (orderError) {
      return NextResponse.json(
        {
          ok: false,
          error: orderError.message,
        },
        { status: 500 }
      );
    }

    const orderItemsPayload = normalizedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_slug: item.slug,
      name: item.name,
      slug: item.slug,
      category: item.category,
      unit_price: item.price,
      price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
      total: item.price * item.quantity,
      image_url: item.image_url,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (orderItemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        {
          ok: false,
          error: orderItemsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      reference,
      order,
    });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to place order.",
      },
      { status: 500 }
    );
  }
}
