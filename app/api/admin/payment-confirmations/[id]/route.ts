import { NextResponse } from "next/server";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission } from "@/lib/admin/permissions";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const allowedStatuses = ["pending", "verified", "rejected"];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
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

    const { id } = await context.params;
    const body = await request.json();

    const status = String(body.status || "pending");
    const adminNotes = String(body.adminNotes || "");
    const markOrderPaid = Boolean(body.markOrderPaid);

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payment confirmation status.",
        },
        { status: 400 }
      );
    }

    const { data: currentConfirmation, error: currentError } =
      await supabaseAdmin
        .from("payment_confirmations")
        .select("*")
        .eq("id", id)
        .single();

    if (currentError || !currentConfirmation) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payment confirmation not found.",
        },
        { status: 404 }
      );
    }

    const { data: confirmation, error: updateError } = await supabaseAdmin
      .from("payment_confirmations")
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          ok: false,
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    let updatedOrder = null;

    if (markOrderPaid && currentConfirmation.order_id) {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("id, order_type, status")
        .eq("id", currentConfirmation.order_id)
        .single();

      let nextOrderStatus = order?.status || "confirmed";

      if (order?.order_type === "quote_deposit") {
        nextOrderStatus = "deposit_paid";
      } else if (order?.status === "pending") {
        nextOrderStatus = "confirmed";
      }

      const { data: paidOrder, error: orderUpdateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: nextOrderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentConfirmation.order_id)
        .select("*")
        .single();

      if (orderUpdateError) {
        return NextResponse.json(
          {
            ok: false,
            error: orderUpdateError.message,
          },
          { status: 500 }
        );
      }

      updatedOrder = paidOrder;
    }

    return NextResponse.json({
      ok: true,
      confirmation,
      updatedOrder,
      message: markOrderPaid
        ? "Payment verified and order marked as paid."
        : "Payment confirmation updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update payment confirmation.",
      },
      { status: 500 }
    );
  }
}