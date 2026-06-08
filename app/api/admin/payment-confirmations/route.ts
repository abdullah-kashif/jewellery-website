import { NextResponse } from "next/server";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission } from "@/lib/admin/permissions";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminUser = await requireCurrentAdminUser();

    if (!hasPermission(adminUser, "can_manage_payments")) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to manage payments.",
        },
        { status: 403 }
      );
    }

    const { data: confirmations, error } = await supabaseAdmin
      .from("payment_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const orderIds = Array.from(
      new Set(
        (confirmations || [])
          .map((confirmation) => confirmation.order_id)
          .filter(Boolean)
      )
    );

    let ordersById: Record<string, unknown> = {};

    if (orderIds.length > 0) {
      const { data: orders, error: ordersError } = await supabaseAdmin
        .from("orders")
        .select(
          "id, reference, order_number, order_type, customer_name, customer_email, email, status, payment_status, total, deposit_amount, created_at"
        )
        .in("id", orderIds);

      if (ordersError) {
        return NextResponse.json(
          {
            ok: false,
            error: ordersError.message,
          },
          { status: 500 }
        );
      }

      ordersById = Object.fromEntries(
        (orders || []).map((order) => [order.id, order])
      );
    }

    const paymentConfirmations = (confirmations || []).map((confirmation) => ({
      ...confirmation,
      order: confirmation.order_id
        ? ordersById[confirmation.order_id] || null
        : null,
    }));

    return NextResponse.json({
      ok: true,
      paymentConfirmations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load payment confirmations.",
      },
      { status: 500 }
    );
  }
}