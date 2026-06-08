// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/supabase/admin";

// export async function GET() {
//   const { data, error } = await supabaseAdmin
//     .from("products")
//     .select("id, name, slug")
//     .limit(5);

//   if (error) {
//     return NextResponse.json(
//       {
//         ok: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json({
//     ok: true,
//     products: data,
//   });
// }

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, slug")
      .limit(5);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          type: "supabase_error",
          error: error.message,
          urlExists: Boolean(supabaseUrl),
          serviceKeyExists: Boolean(serviceKey),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      products: data,
      urlExists: Boolean(supabaseUrl),
      serviceKeyExists: Boolean(serviceKey),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        type: "catch_error",
        error: error instanceof Error ? error.message : String(error),
        urlExists: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        serviceKeyExists: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
      { status: 500 }
    );
  }
}