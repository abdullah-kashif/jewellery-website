"use client";

import { useEffect, useState } from "react";
import type { AdminRole, AdminUser } from "@/lib/admin/permissions";

type AdminFormState = {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  can_manage_products: boolean;
  can_manage_orders: boolean;
  can_manage_quotes: boolean;
  can_manage_messages: boolean;
  can_manage_payments: boolean;
  can_manage_admins: boolean;
};

const roleOptions: { value: AdminRole; label: string }[] = [
  { value: "product_manager", label: "Product Manager" },
  { value: "order_manager", label: "Order Manager" },
  { value: "support_admin", label: "Support Admin" },
  { value: "viewer", label: "Viewer" },
];

const permissionOptions: {
  key:
    | "can_manage_products"
    | "can_manage_orders"
    | "can_manage_quotes"
    | "can_manage_messages"
    | "can_manage_payments"
    | "can_manage_admins";
  label: string;
  description: string;
}[] = [
  {
    key: "can_manage_products",
    label: "Products",
    description: "Add, edit, and delete products.",
  },
  {
    key: "can_manage_orders",
    label: "Orders",
    description: "View and update customer orders.",
  },
  {
    key: "can_manage_quotes",
    label: "Quotes",
    description: "Manage custom jewellery quote requests.",
  },
  {
    key: "can_manage_messages",
    label: "Messages",
    description: "View customer contact messages.",
  },
  {
    key: "can_manage_payments",
    label: "Payments",
    description: "Verify payment proofs and mark orders paid.",
  },
  {
    key: "can_manage_admins",
    label: "Admins",
    description: "Create and manage sub-admins.",
  },
];

const initialForm: AdminFormState = {
  fullName: "",
  email: "",
  password: "",
  role: "viewer",
  isActive: true,
  can_manage_products: false,
  can_manage_orders: false,
  can_manage_quotes: false,
  can_manage_messages: false,
  can_manage_payments: false,
  can_manage_admins: false,
};

function prettyRole(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function AdminUsersClient() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<AdminFormState>(initialForm);
  const [savingId, setSavingId] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAdmins() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/admins", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to load admins.");
      }

      setAdmins(result.admins || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load admins."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  function updateForm<K extends keyof AdminFormState>(
    key: K,
    value: AdminFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function createAdmin() {
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to create admin.");
      }

      setSuccess("Sub-admin created successfully.");
      setForm(initialForm);
      await loadAdmins();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create admin."
      );
    } finally {
      setCreating(false);
    }
  }

  async function updateAdmin(admin: AdminUser) {
    setSavingId(admin.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admin),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Failed to update admin.");
      }

      setSuccess("Admin updated successfully.");
      await loadAdmins();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update admin."
      );
    } finally {
      setSavingId("");
    }
  }

  function updateAdminLocal<K extends keyof AdminUser>(
    adminId: string,
    key: K,
    value: AdminUser[K]
  ) {
    setAdmins((current) =>
      current.map((admin) =>
        admin.id === adminId
          ? {
              ...admin,
              [key]: value,
            }
          : admin
      )
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
          Create Sub Admin
        </p>

        <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
          New Admin User
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Full Name">
            <input
              value={form.fullName}
              onChange={(event) => updateForm("fullName", event.target.value)}
              className="admin-input"
              placeholder="Admin full name"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              className="admin-input"
              placeholder="admin@example.com"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateForm("password", event.target.value)}
              className="admin-input"
              placeholder="Minimum 8 characters"
            />
          </Field>

          <Field label="Role">
            <select
              value={form.role}
              onChange={(event) =>
                updateForm("role", event.target.value as AdminRole)
              }
              className="admin-input"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6">
          <label className="flex gap-3 rounded-2xl border border-[#eadfca] bg-[#fbf7ef] p-4 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateForm("isActive", event.target.checked)}
              className="mt-1"
            />
            <span>
              <strong className="text-neutral-950">Active Admin</strong>
              <br />
              This admin can login when active.
            </span>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {permissionOptions.map((permission) => (
            <label
              key={permission.key}
              className="flex gap-3 rounded-2xl border border-[#eadfca] bg-[#fbf7ef] p-4 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                checked={form[permission.key]}
                onChange={(event) =>
                  updateForm(permission.key, event.target.checked)
                }
                className="mt-1"
              />

              <span>
                <strong className="text-neutral-950">
                  {permission.label}
                </strong>
                <br />
                {permission.description}
              </span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={createAdmin}
          disabled={creating}
          className="mt-8 rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Sub Admin"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
              Existing Admins
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-neutral-950">
              Manage Permissions
            </h2>
          </div>

          <button
            type="button"
            onClick={loadAdmins}
            className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white hover:bg-[#a77a25]"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-[#fbf7ef] p-8 text-center text-neutral-600">
            Loading admins...
          </div>
        ) : admins.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-[#fbf7ef] p-8 text-center text-neutral-600">
            No admin users found.
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-3xl border border-[#eadfca] bg-[#fbf7ef] p-5"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[#a77a25] uppercase">
                      {prettyRole(admin.role)}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-neutral-950">
                      {admin.full_name}
                    </h3>

                    <p className="mt-1 text-sm text-neutral-600">
                      {admin.email}
                    </p>

                    <p className="mt-2 text-xs text-neutral-500">
                      Created: {formatDate(admin.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <select
                      value={admin.role}
                      onChange={(event) =>
                        updateAdminLocal(
                          admin.id,
                          "role",
                          event.target.value as AdminRole
                        )
                      }
                      className="rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm outline-none focus:border-[#a77a25]"
                    >
                      <option value="super_admin">Super Admin</option>
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => updateAdmin(admin)}
                      disabled={savingId === admin.id}
                      className="rounded-full bg-[#a77a25] px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingId === admin.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="flex gap-3 rounded-2xl border border-[#eadfca] bg-white p-4 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={admin.is_active}
                      onChange={(event) =>
                        updateAdminLocal(
                          admin.id,
                          "is_active",
                          event.target.checked
                        )
                      }
                      className="mt-1"
                    />

                    <span>
                      <strong className="text-neutral-950">Active</strong>
                      <br />
                      Admin can login when active.
                    </span>
                  </label>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {permissionOptions.map((permission) => (
                    <label
                      key={permission.key}
                      className="flex gap-3 rounded-2xl border border-[#eadfca] bg-white p-4 text-sm text-neutral-700"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(admin[permission.key])}
                        onChange={(event) =>
                          updateAdminLocal(
                            admin.id,
                            permission.key,
                            event.target.checked
                          )
                        }
                        className="mt-1"
                      />

                      <span>
                        <strong className="text-neutral-950">
                          {permission.label}
                        </strong>
                        <br />
                        {permission.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
        {label}
      </span>

      {children}
    </label>
  );
}