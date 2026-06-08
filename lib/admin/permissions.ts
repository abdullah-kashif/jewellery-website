export type AdminRole =
  | "super_admin"
  | "product_manager"
  | "order_manager"
  | "support_admin"
  | "viewer";

export type AdminPermissionKey =
  | "can_manage_products"
  | "can_manage_orders"
  | "can_manage_quotes"
  | "can_manage_messages"
  | "can_manage_payments"
  | "can_manage_admins";

export type AdminUser = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;

  can_manage_products: boolean;
  can_manage_orders: boolean;
  can_manage_quotes: boolean;
  can_manage_messages: boolean;
  can_manage_payments: boolean;
  can_manage_admins: boolean;

  created_at: string;
  updated_at: string | null;
};

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  product_manager: "Product Manager",
  order_manager: "Order Manager",
  support_admin: "Support Admin",
  viewer: "Viewer",
};

export const adminSections: {
  title: string;
  description: string;
  href: string;
  permission: AdminPermissionKey;
}[] = [
  {
    title: "Products",
    description: "Add, edit, and delete jewellery products.",
    href: "/admin/products",
    permission: "can_manage_products",
  },
  {
    title: "Orders",
    description: "View checkout orders and update order status.",
    href: "/admin/orders",
    permission: "can_manage_orders",
  },
  {
    title: "Quotes",
    description: "View custom jewellery quote requests.",
    href: "/admin/quotes",
    permission: "can_manage_quotes",
  },
  {
    title: "Messages",
    description: "View customer contact messages.",
    href: "/admin/messages",
    permission: "can_manage_messages",
  },
  {
    title: "Payments",
    description: "Review payment proofs and mark customer orders as paid.",
    href: "/admin/payments",
    permission: "can_manage_payments",
  },
  {
    title: "Admins",
    description: "Create sub-admins and manage admin permissions.",
    href: "/admin/admins",
    permission: "can_manage_admins",
  },
];

export function hasPermission(
  adminUser: AdminUser | null,
  permission: AdminPermissionKey
) {
  if (!adminUser || !adminUser.is_active) {
    return false;
  }

  if (adminUser.role === "super_admin") {
    return true;
  }

  return Boolean(adminUser[permission]);
}

export function getAllowedAdminSections(adminUser: AdminUser | null) {
  return adminSections.filter((section) =>
    hasPermission(adminUser, section.permission)
  );
}