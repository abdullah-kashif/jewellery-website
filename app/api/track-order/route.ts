import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function normalizeReference(value: unknown) {
  return cleanText(value).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reference = normalizeReference(body.reference);
    const email = cleanText(body.email).toLowerCase();

    if (!reference) {
      return NextResponse.json(
        {
          ok: false,
          error: "Order reference is required.",
        },
        { status: 400 }
      );
    }

    const { data: ordersByReference, error: referenceError } =
      await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("reference", reference)
        .limit(5);

    if (referenceError) {
      return NextResponse.json(
        {
          ok: false,
          error: referenceError.message,
        },
        { status: 500 }
      );
    }

    let orders = ordersByReference || [];

    if (orders.length === 0) {
      const { data: ordersByNumber, error: numberError } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("order_number", reference)
        .limit(5);

      if (numberError) {
        return NextResponse.json(
          {
            ok: false,
            error: numberError.message,
          },
          { status: 500 }
        );
      }

      orders = ordersByNumber || [];
    }

    if (orders.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "No order found with this reference.",
        },
        { status: 404 }
      );
    }

    let order = orders[0];

    if (email) {
      const matchedOrder = orders.find((item) => {
        const orderEmail = String(
          item.customer_email || item.email || ""
        ).toLowerCase();

        return orderEmail === email;
      });

      if (!matchedOrder) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Order reference found, but email does not match our records.",
          },
          { status: 404 }
        );
      }

      order = matchedOrder;
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (itemsError) {
      return NextResponse.json(
        {
          ok: false,
          error: itemsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      order,
      items: items || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to track order.",
      },
      { status: 500 }
    );
  }
}