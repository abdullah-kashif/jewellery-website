import { NextResponse } from "next/server";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function getOrderTotal(order: {
  total?: number | null;
  total_amount?: number | null;
  deposit_amount?: number | null;
}) {
  return Number(order.total ?? order.total_amount ?? order.deposit_amount ?? 0);
}

export async function POST(request: Request) {
  try {
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error: "PayPal credentials are not configured yet.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const orderId = String(body.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, reference, order_number, total, total_amount, deposit_amount, payment_status"
      )
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { ok: false, error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { ok: false, error: "This order is already paid." },
        { status: 400 }
      );
    }

    const amount = getOrderTotal(order);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Order amount is not valid for PayPal." },
        { status: 400 }
      );
    }

    const paypalOrder = await createPayPalOrder({
      orderId: order.id,
      reference: order.reference || order.order_number || order.id,
      amount,
      currency: "USD",
    });

    return NextResponse.json({
      ok: true,
      paypalOrderId: paypalOrder.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create PayPal order.",
      },
      { status: 500 }
    );
  }
}
