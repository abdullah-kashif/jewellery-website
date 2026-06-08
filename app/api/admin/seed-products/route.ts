import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { seedProducts } from "@/lib/seed-products";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .upsert(seedProducts, {
        onConflict: "slug",
      })
      .select("id, name, slug");

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
      message: "Products seeded successfully.",
      count: data?.length || 0,
      products: data,
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