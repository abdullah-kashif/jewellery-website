import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateOrderBody = {
  status?: string;
  paymentStatus?: string;
  notes?: string;
};

function cleanText(value?: string) {
  return String(value || "").trim();
}

const allowedOrderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "crafted",
  "quality_check",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",

  // quote deposit order statuses
  "deposit_pending",
  "deposit_paid",
  "in_production",
  "production_completed",
];

const allowedPaymentStatuses = [
  "pending",
  "awaiting_transfer",
  "paid",
  "failed",
  "refunded",
];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateOrderBody;

    const status = cleanText(body.status || "pending");
    const paymentStatus = cleanText(body.paymentStatus || "pending");
    const notes = cleanText(body.notes);

    if (!allowedOrderStatuses.includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payment status.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        payment_status: paymentStatus,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, order_items(*)")
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
      order: data,
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