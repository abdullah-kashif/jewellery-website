"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { clearStaleBrowserSession } from "@/lib/supabase/clear-stale-session";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      await clearStaleBrowserSession(supabase);

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw new Error(loginError.message);
      }

      router.push(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm"
    >
      <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        Admin Access
      </p>

      <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
        Login to Admin Panel
      </h1>

      <p className="mt-4 leading-7 text-neutral-600">
        Login with your Supabase Auth admin email and password.
      </p>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8">
        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Email
        </label>

        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none transition focus:border-[#a77a25]"
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
          Password
        </label>

        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none transition focus:border-[#a77a25]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
