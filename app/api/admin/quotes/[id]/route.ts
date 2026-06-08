import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateQuoteBody = {
  status?: string;
  quotedPrice?: number | string | null;
  adminNotes?: string;
};

const allowedQuoteStatuses = [
  "pending",
  "reviewing",
  "quoted",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function cleanPrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue < 0) {
    return null;
  }

  return numberValue;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateQuoteBody;

    const status = cleanText(body.status || "pending");
    const quotedPrice = cleanPrice(body.quotedPrice);
    const adminNotes = cleanText(body.adminNotes);

    if (!allowedQuoteStatuses.includes(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid quote status.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .update({
        status,
        quoted_price: quotedPrice,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
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
      quote: data,
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