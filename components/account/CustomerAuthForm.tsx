"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "signup";

export function CustomerAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "";

  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          throw new Error(loginError.message);
        }

        if (nextPath.startsWith("/")) {
          router.push(nextPath);
        } else {
          router.refresh();
        }
        return;
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            country,
          },
        },
      });

      if (signupError) {
        throw new Error(signupError.message);
      }

      if (!data.user) {
        setSuccess("Account created. Please check your email to confirm.");
        return;
      }

      const { error: profileError } = await supabase
        .from("customer_profiles")
        .insert({
          user_id: data.user.id,
          full_name: fullName,
          email,
          phone,
          country,
        });

      if (profileError) {
        throw new Error(profileError.message);
      }

      setSuccess("Account created successfully.");
      if (nextPath.startsWith("/")) {
        router.push(nextPath);
      } else {
        router.refresh();
      }
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        Customer Account
      </p>

      <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
        {mode === "login" ? "Login to Your Account" : "Create Your Account"}
      </h1>

      <p className="mt-4 leading-7 text-neutral-600">
        Save your details, track orders, manage wishlist, and request custom
        jewellery quotes faster.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 rounded-full bg-[#fbf7ef] p-2">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError("");
            setSuccess("");
          }}
          className={`rounded-full px-5 py-3 text-sm font-semibold ${
            mode === "login"
              ? "bg-neutral-950 text-white"
              : "text-neutral-700 hover:bg-white"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
            setSuccess("");
          }}
          className={`rounded-full px-5 py-3 text-sm font-semibold ${
            mode === "signup"
              ? "bg-neutral-950 text-white"
              : "text-neutral-700 hover:bg-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === "signup" && (
          <>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                Full Name
              </label>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+92..."
                  className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
                  Country
                </label>
                <input
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Pakistan"
                  className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-neutral-700 uppercase">
            Password
          </label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-sm outline-none focus:border-[#a77a25]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#a77a25] px-8 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Login"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
}
