import { NextResponse } from "next/server";
import { requireCurrentAdminUser } from "@/lib/admin/current-admin";
import { hasPermission, type AdminRole } from "@/lib/admin/permissions";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const allowedRoles: AdminRole[] = [
  "super_admin",
  "product_manager",
  "order_manager",
  "support_admin",
  "viewer",
];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function cleanText(value?: string | null) {
  return String(value || "").trim();
}

function cleanBoolean(value: unknown) {
  return Boolean(value);
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentAdmin = await requireCurrentAdminUser();

    if (!hasPermission(currentAdmin, "can_manage_admins")) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to update admins.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const fullName = cleanText(body.fullName || body.full_name);
    const role = cleanText(body.role) as AdminRole;

    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid admin role.",
        },
        { status: 400 }
      );
    }

    const { data: existingAdmin, error: existingError } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();

    if (existingError || !existingAdmin) {
      return NextResponse.json(
        {
          ok: false,
          error: "Admin user not found.",
        },
        { status: 404 }
      );
    }

    if (
      existingAdmin.role === "super_admin" &&
      existingAdmin.id !== currentAdmin.id
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "You cannot modify another super admin.",
        },
        { status: 403 }
      );
    }

    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from("admin_users")
      .update({
        full_name: fullName || existingAdmin.full_name,
        role,
        is_active: cleanBoolean(body.is_active ?? body.isActive),

        can_manage_products: cleanBoolean(body.can_manage_products),
        can_manage_orders: cleanBoolean(body.can_manage_orders),
        can_manage_quotes: cleanBoolean(body.can_manage_quotes),
        can_manage_messages: cleanBoolean(body.can_manage_messages),
        can_manage_payments: cleanBoolean(body.can_manage_payments),
        can_manage_admins: cleanBoolean(body.can_manage_admins),

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

    return NextResponse.json({
      ok: true,
      admin: updatedAdmin,
      message: "Admin user updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update admin.",
      },
      { status: 500 }
    );
  }
}