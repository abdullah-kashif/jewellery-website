import { NextResponse } from "next/server";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission, type AdminRole } from "@/lib/admin/permissions";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const allowedRoles: AdminRole[] = [
  "product_manager",
  "order_manager",
  "support_admin",
  "viewer",
];

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function cleanBoolean(value: unknown) {
  return Boolean(value);
}

export async function GET() {
  try {
    const adminUser = await requireCurrentAdminUser();

    if (!hasPermission(adminUser, "can_manage_admins")) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to manage admins.",
        },
        { status: 403 }
      );
    }

    const { data: admins, error } = await supabaseAdmin
      .from("admin_users")
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

    return NextResponse.json({
      ok: true,
      admins: admins || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to load admins.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await requireCurrentAdminUser();

    if (!hasPermission(adminUser, "can_manage_admins")) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to create admins.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const fullName = cleanText(body.fullName || body.full_name);
    const email = cleanText(body.email).toLowerCase();
    const password = String(body.password || "");
    const role = cleanText(body.role) as AdminRole;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        {
          ok: false,
          error: "Full name, email, password, and role are required.",
        },
        { status: 400 }
      );
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid admin role.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const { data: createdUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

    if (authError || !createdUser.user) {
      return NextResponse.json(
        {
          ok: false,
          error: authError?.message || "Failed to create auth user.",
        },
        { status: 500 }
      );
    }

    const userId = createdUser.user.id;

    const { data: createdAdmin, error: insertError } = await supabaseAdmin
      .from("admin_users")
      .insert({
        user_id: userId,
        full_name: fullName,
        email,
        role,
        is_active: cleanBoolean(body.isActive ?? true),

        can_manage_products: cleanBoolean(body.can_manage_products),
        can_manage_orders: cleanBoolean(body.can_manage_orders),
        can_manage_quotes: cleanBoolean(body.can_manage_quotes),
        can_manage_messages: cleanBoolean(body.can_manage_messages),
        can_manage_payments: cleanBoolean(body.can_manage_payments),
        can_manage_admins: cleanBoolean(body.can_manage_admins),
      })
      .select("*")
      .single();

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return NextResponse.json(
        {
          ok: false,
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      admin: createdAdmin,
      message: "Sub-admin created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to create admin.",
      },
      { status: 500 }
    );
  }
}