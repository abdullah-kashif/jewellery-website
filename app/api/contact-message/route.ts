import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ContactMessageBody = {
  fullName?: string;
  email?: string;
  whatsapp?: string;
  subject?: string;
  product?: string;
  orderNumber?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactMessageBody;

    if (!body.fullName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Name, email, subject, and message are required.",
        },
        { status: 400 }
      );
    }

    const reference = `LXM-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        reference,
        full_name: body.fullName,
        email: body.email,
        whatsapp: body.whatsapp || null,
        subject: body.subject,
        product: body.product || null,
        order_number: body.orderNumber || null,
        message: body.message,
      })
      .select("id, reference")
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
      message: data,
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