import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type QuoteForDeposit = {
  id: string;
  reference: string | null;
  customer_user_id: string | null;
  customer_profile_id: string | null;
  full_name: string | null;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  product: string | null;
  product_type: string | null;
  metal: string | null;
  metal_type: string | null;
  stone: string | null;
  stone_type: string | null;
  gold_karat: string | null;
  size: string | null;
  ring_size: string | null;
  status: string | null;
  quoted_price: number | null;
  deposit_order_id: string | null;
};

function createOrderReference() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LXO-${random}`;
}

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please login before creating a deposit order.",
        },
        { status: 401 }
      );
    }

    const { data: quote, error: quoteError } = await supabaseAdmin
      .from("quote_requests")
      .select(
        "id, reference, customer_user_id, customer_profile_id, full_name, email, whatsapp, country, product, product_type, metal, metal_type, stone, stone_type, gold_karat, size, ring_size, status, quoted_price, deposit_order_id"
      )
      .eq("id", id)
      .single<QuoteForDeposit>();

    if (quoteError || !quote) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quote request not found.",
        },
        { status: 404 }
      );
    }

    const userEmail = user.email || "";
    const quoteEmail = quote.email || "";

    const isOwner =
      quote.customer_user_id === user.id ||
      quoteEmail.toLowerCase() === userEmail.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to create this deposit order.",
        },
        { status: 403 }
      );
    }

    if (quote.deposit_order_id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Deposit order already exists for this quote.",
        },
        { status: 400 }
      );
    }

    if (quote.status !== "approved") {
      return NextResponse.json(
        {
          ok: false,
          error: "Only approved quotes can be converted into deposit orders.",
        },
        { status: 400 }
      );
    }

    if (!quote.quoted_price || Number(quote.quoted_price) <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quoted price is missing.",
        },
        { status: 400 }
      );
    }

    const reference = createOrderReference();
    const quoteReference = quote.reference || quote.id;
    const quotedPrice = Number(quote.quoted_price);
    const depositPercentage = 30;
    const depositAmount = Math.round(quotedPrice * depositPercentage) / 100;

    const productType =
      quote.product_type || quote.product || "Custom Jewellery";
    const metalType = quote.metal_type || quote.metal || "Not selected";
    const stoneType = quote.stone_type || quote.stone || "Not selected";
    const jewellerySize = quote.size || quote.ring_size || "Not provided";

    const itemName = `Deposit for ${productType} - ${quoteReference}`;
    const itemSlug = createSlug(`deposit-${quoteReference}-${productType}`);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        reference,
        order_number: reference,

        quote_request_id: quote.id,
        order_type: "quote_deposit",

        customer_user_id: user.id,
        customer_profile_id: quote.customer_profile_id,

        customer_name: cleanText(quote.full_name) || userEmail,
        customer_email: cleanText(quote.email) || userEmail,
        email: cleanText(quote.email) || userEmail,

        whatsapp: cleanText(quote.whatsapp),
        country: cleanText(quote.country),

        address: "",
        city: "",
        state: "",
        postal_code: "",

        subtotal: depositAmount,
        shipping: 0,
        total: depositAmount,

        deposit_percentage: depositPercentage,
        deposit_amount: depositAmount,

        payment_method: "manual",
        payment_status: "pending",
        status: "deposit_pending",

        notes: `Deposit order for approved quote ${quoteReference}. Quoted price: $${quotedPrice}. Deposit: ${depositPercentage}%. Product: ${productType}. Metal: ${metalType}. Stone: ${stoneType}. Size: ${jewellerySize}.`,
      })
      .select("*")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          ok: false,
          error: orderError?.message || "Failed to create deposit order.",
        },
        { status: 500 }
      );
    }

    const { error: itemError } = await supabaseAdmin.from("order_items").insert({
      order_id: order.id,
      quote_request_id: quote.id,

      name: itemName,
      slug: itemSlug,

      product_name: itemName,
      product_slug: itemSlug,

      quantity: 1,
      price: depositAmount,
      unit_price: depositAmount,
      line_total: depositAmount,
    });

    if (itemError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        {
          ok: false,
          error: itemError.message,
        },
        { status: 500 }
      );
    }

    const now = new Date().toISOString();

    const { data: updatedQuote, error: quoteUpdateError } = await supabaseAdmin
      .from("quote_requests")
      .update({
        status: "deposit_pending",
        deposit_percentage: depositPercentage,
        deposit_amount: depositAmount,
        deposit_order_id: order.id,
        deposit_created_at: now,
        updated_at: now,
      })
      .eq("id", quote.id)
      .select("*")
      .single();

    if (quoteUpdateError) {
      return NextResponse.json(
        {
          ok: false,
          error: quoteUpdateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      order,
      quote: updatedQuote,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}