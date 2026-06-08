import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function makeSafeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^a-z0-9.-]/g, "");
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please login before submitting payment proof.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const orderId = String(formData.get("orderId") || "");
    const transactionId = String(formData.get("transactionId") || "");
    const message = String(formData.get("message") || "");
    const file = formData.get("proof") as File | null;

    if (!orderId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    if (!transactionId.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Transaction ID is required.",
        },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payment proof file is required.",
        },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, reference, order_number, customer_user_id, customer_email, email, customer_name, total, total_amount, deposit_amount, payment_status"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          ok: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    const orderEmail = String(order.customer_email || order.email || "");
    const userEmail = String(user.email || "");

    const isOwner =
      order.customer_user_id === user.id ||
      orderEmail.toLowerCase() === userEmail.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to submit proof for this order.",
        },
        { status: 403 }
      );
    }

    const reference = order.reference || order.order_number || order.id;
    const amount = Number(
      order.total ?? order.total_amount ?? order.deposit_amount ?? 0
    );

    const safeName = makeSafeFileName(file.name || "payment-proof");
    const filePath = `${user.id}/${order.id}/${Date.now()}-${safeName}`;

    const uploadResult = await supabaseAdmin.storage
      .from("payment-proofs")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadResult.error) {
      return NextResponse.json(
        {
          ok: false,
          error: uploadResult.error.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("payment-proofs").getPublicUrl(filePath);

    const { data: confirmation, error: insertError } = await supabaseAdmin
      .from("payment_confirmations")
      .insert({
        order_id: order.id,
        customer_user_id: user.id,
        customer_email: userEmail,
        customer_name: order.customer_name,
        reference,
        amount,
        payment_method: "bank_transfer",
        transaction_id: transactionId.trim(),
        proof_url: publicUrl,
        proof_file_name: file.name,
        message,
        status: "pending",
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          ok: false,
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "awaiting_transfer",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return NextResponse.json({
      ok: true,
      confirmation,
      message: "Payment proof submitted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit payment proof.",
      },
      { status: 500 }
    );
  }
}