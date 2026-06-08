import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function safeCount(tableName: string) {
  try {
    const { count, error } = await supabaseAdmin
      .from(tableName)
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      return 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}

function getOrderTotal(order: {
  total?: number | string | null;
  total_amount?: number | string | null;
}) {
  const value = Number(order.total ?? order.total_amount ?? 0);

  if (Number.isNaN(value)) {
    return 0;
  }

  return value;
}

export async function GET() {
  try {
    const [
      productsCount,
      quotesCount,
      messagesCount,
      ordersResponse,
      recentOrdersResponse,
    ] = await Promise.all([
      safeCount("products"),
      safeCount("quote_requests"),
      safeCount("contact_messages"),
      supabaseAdmin
        .from("orders")
        .select(
          "id, reference, order_number, customer_name, customer_email, email, status, payment_status, total, total_amount, created_at"
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("orders")
        .select(
          "id, reference, order_number, customer_name, customer_email, email, status, payment_status, total, total_amount, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    if (ordersResponse.error) {
      return NextResponse.json(
        {
          ok: false,
          error: ordersResponse.error.message,
        },
        { status: 500 }
      );
    }

    if (recentOrdersResponse.error) {
      return NextResponse.json(
        {
          ok: false,
          error: recentOrdersResponse.error.message,
        },
        { status: 500 }
      );
    }

    const orders = ordersResponse.data || [];

    const totalOrders = orders.length;

    const pendingOrders = orders.filter((order) => {
      return String(order.status || "pending") === "pending";
    }).length;

    const processingOrders = orders.filter((order) => {
      return ["confirmed", "processing", "crafted", "quality_check"].includes(
        String(order.status || "")
      );
    }).length;

    const shippedOrders = orders.filter((order) => {
      return ["shipped", "out_for_delivery"].includes(String(order.status || ""));
    }).length;

    const deliveredOrders = orders.filter((order) => {
      return String(order.status || "") === "delivered";
    }).length;

    const paidRevenue = orders
      .filter((order) => String(order.payment_status || "") === "paid")
      .reduce((sum, order) => sum + getOrderTotal(order), 0);

    const pendingRevenue = orders
      .filter((order) => String(order.payment_status || "") !== "paid")
      .reduce((sum, order) => sum + getOrderTotal(order), 0);

    return NextResponse.json({
      ok: true,
      stats: {
        productsCount,
        quotesCount,
        messagesCount,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        paidRevenue,
        pendingRevenue,
      },
      recentOrders: recentOrdersResponse.data || [],
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