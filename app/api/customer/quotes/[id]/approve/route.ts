import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ApproveQuoteBody = {
  customerResponse?: string;
};

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

export async function PATCH(request: Request, context: RouteContext) {
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
          error: "Please login before approving a quote.",
        },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as ApproveQuoteBody;
    const customerResponse = cleanText(body.customerResponse);

    const { data: quote, error: quoteError } = await supabaseAdmin
      .from("quote_requests")
      .select(
        "id, customer_user_id, email, status, quoted_price, customer_approved_at"
      )
      .eq("id", id)
      .single();

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
          error: "You do not have permission to approve this quote.",
        },
        { status: 403 }
      );
    }

    if (!quote.quoted_price) {
      return NextResponse.json(
        {
          ok: false,
          error: "This quote does not have a quoted price yet.",
        },
        { status: 400 }
      );
    }

    if (quote.status !== "quoted") {
      return NextResponse.json(
        {
          ok: false,
          error: "Only quoted requests can be approved.",
        },
        { status: 400 }
      );
    }

    const approvedAt = new Date().toISOString();

    const { data: updatedQuote, error: updateError } = await supabaseAdmin
      .from("quote_requests")
      .update({
        status: "approved",
        customer_approved_at: approvedAt,
        customer_response: customerResponse || "Customer approved the quote.",
        updated_at: approvedAt,
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

    return NextResponse.json({
      ok: true,
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