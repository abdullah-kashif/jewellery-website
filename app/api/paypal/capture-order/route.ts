import { NextResponse } from "next/server";
import { capturePayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

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
    const paypalOrderId = String(body.paypalOrderId || "").trim();

    if (!orderId || !paypalOrderId) {
      return NextResponse.json(
        { ok: false, error: "Order ID and PayPal order ID are required." },
        { status: 400 }
      );
    }

    const paypalOrder = await capturePayPalOrder(paypalOrderId);
    const purchaseUnit = paypalOrder.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (purchaseUnit?.custom_id && purchaseUnit.custom_id !== orderId) {
      return NextResponse.json(
        { ok: false, error: "PayPal order does not match this website order." },
        { status: 400 }
      );
    }

    if (paypalOrder.status !== "COMPLETED" && capture?.status !== "COMPLETED") {
      return NextResponse.json(
        { ok: false, error: "PayPal payment was not completed." },
        { status: 400 }
      );
    }

    const { data: currentOrder } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .single();

    const nextStatus =
      !currentOrder?.status || currentOrder.status === "pending"
        ? "confirmed"
        : currentOrder.status;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_method: "paypal",
        payment_status: "paid",
        status: nextStatus,
        notes: `PayPal payment captured. PayPal order: ${paypalOrderId}. Capture: ${
          capture?.id || "not available"
        }.`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      order,
      paypalOrder,
      captureId: capture?.id || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to capture PayPal payment.",
      },
      { status: 500 }
    );
  }
}
