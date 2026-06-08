import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

type AdminPermissionKey =
  | "can_manage_products"
  | "can_manage_orders"
  | "can_manage_quotes"
  | "can_manage_messages"
  | "can_manage_admins";

type MiddlewareAdminUser = {
  id: string;
  role: string;
  is_active: boolean;
  can_manage_products: boolean;
  can_manage_orders: boolean;
  can_manage_quotes: boolean;
  can_manage_messages: boolean;
  can_manage_admins: boolean;
};

function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login";
}

function isAdminAuthApi(pathname: string) {
  return pathname === "/api/admin/login" || pathname === "/api/admin/logout";
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function redirectToAccessDenied(request: NextRequest) {
  const adminUrl = new URL("/admin", request.url);
  adminUrl.searchParams.set("access", "denied");
  return NextResponse.redirect(adminUrl);
}

function getRequiredPermission(pathname: string): AdminPermissionKey | null {
  if (pathname === "/admin") {
    return null;
  }

  if (isAdminLoginPath(pathname) || isAdminAuthApi(pathname)) {
    return null;
  }

  if (
    pathname.startsWith("/admin/products") ||
    pathname.startsWith("/api/admin/products") ||
    pathname.startsWith("/api/admin/seed-products")
  ) {
    return "can_manage_products";
  }

  if (
    pathname.startsWith("/admin/orders") ||
    pathname.startsWith("/api/admin/orders")
  ) {
    return "can_manage_orders";
  }

  if (
    pathname.startsWith("/admin/quotes") ||
    pathname.startsWith("/api/admin/quotes")
  ) {
    return "can_manage_quotes";
  }

  if (
    pathname.startsWith("/admin/messages") ||
    pathname.startsWith("/api/admin/messages")
  ) {
    return "can_manage_messages";
  }

  if (
    pathname.startsWith("/admin/admins") ||
    pathname.startsWith("/api/admin/admins")
  ) {
    return "can_manage_admins";
  }

  return null;
}

function hasAdminPermission(
  adminUser: MiddlewareAdminUser,
  permission: AdminPermissionKey
) {
  if (!adminUser.is_active) {
    return false;
  }

  if (adminUser.role === "super_admin") {
    return true;
  }

  return Boolean(adminUser[permission]);
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  const isProtectedAdminPage =
    isAdminPath(pathname) && !isAdminLoginPath(pathname);

  const isProtectedAdminApi = isAdminApi(pathname) && !isAdminAuthApi(pathname);

  const shouldCheckAdmin =
    isProtectedAdminPage || isProtectedAdminApi || isAdminLoginPath(pathname);

  if (!shouldCheckAdmin) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminLoginPath(pathname)) {
    if (!user) {
      return response;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select(
        "id, role, is_active, can_manage_products, can_manage_orders, can_manage_quotes, can_manage_messages, can_manage_admins"
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (adminUser) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  if (!user) {
    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized admin request.",
        },
        { status: 401 }
      );
    }

    return redirectToLogin(request);
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select(
      "id, role, is_active, can_manage_products, can_manage_orders, can_manage_quotes, can_manage_messages, can_manage_admins"
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminUser) {
    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          ok: false,
          error: "You are logged in but not allowed to access admin panel.",
        },
        { status: 403 }
      );
    }

    return redirectToLogin(request);
  }

  const requiredPermission = getRequiredPermission(pathname);

  if (
    requiredPermission &&
    !hasAdminPermission(adminUser as MiddlewareAdminUser, requiredPermission)
  ) {
    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not have permission to perform this admin action.",
        },
        { status: 403 }
      );
    }

    return redirectToAccessDenied(request);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};