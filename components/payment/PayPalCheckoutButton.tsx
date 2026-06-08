"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID?: string }) => Promise<void>;
        onError: (error: unknown) => void;
      }) => {
        render: (selector: string | HTMLElement) => Promise<void>;
        close?: () => void;
      };
    };
  }
}

type PayPalCheckoutButtonProps = {
  orderId: string;
  reference: string;
  amount: number;
  clientId?: string;
  alreadyPaid?: boolean;
};

let paypalScriptPromise: Promise<void> | null = null;

function loadPayPalScript(clientId: string) {
  if (window.paypal) {
    return Promise.resolve();
  }

  if (paypalScriptPromise) {
    return paypalScriptPromise;
  }

  paypalScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayPal button."));
    document.body.appendChild(script);
  });

  return paypalScriptPromise;
}

export function PayPalCheckoutButton({
  orderId,
  reference,
  amount,
  clientId,
  alreadyPaid = false,
}: PayPalCheckoutButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRef = useRef<{ close?: () => void } | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderButtons() {
      setError("");

      if (!clientId || alreadyPaid || success || !containerRef.current) {
        return;
      }

      try {
        await loadPayPalScript(clientId);

        if (cancelled || !window.paypal || !containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = "";

        const buttons = window.paypal.Buttons({
          async createOrder() {
            setLoading(true);
            setError("");

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ orderId }),
            });

            const result = await response.json();

            if (!response.ok || !result.ok || !result.paypalOrderId) {
              setLoading(false);
              throw new Error(result.error || "Failed to start PayPal payment.");
            }

            setLoading(false);
            return result.paypalOrderId;
          },

          async onApprove(data) {
            setLoading(true);
            setError("");

            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId,
                  paypalOrderId: data.orderID,
                }),
              });

              const result = await response.json();

              if (!response.ok || !result.ok) {
                throw new Error(result.error || "Failed to capture PayPal payment.");
              }

              setSuccess(true);
            } catch (captureError) {
              setError(
                captureError instanceof Error
                  ? captureError.message
                  : "Failed to capture PayPal payment."
              );
            } finally {
              setLoading(false);
            }
          },

          onError(paypalError) {
            setLoading(false);
            setError(
              paypalError instanceof Error
                ? paypalError.message
                : "PayPal payment could not be completed."
            );
          },
        });

        paypalButtonsRef.current = buttons;
        await buttons.render(containerRef.current);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "PayPal button is not available right now."
        );
      }
    }

    renderButtons();

    return () => {
      cancelled = true;
      paypalButtonsRef.current?.close?.();
      paypalButtonsRef.current = null;
    };
  }, [alreadyPaid, clientId, orderId, success]);

  if (alreadyPaid || success) {
    return (
      <div className="rounded-[2rem] border border-green-200 bg-green-50 p-8 text-green-800 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase">
          Payment Complete
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
          PayPal Payment Received
        </h2>
        <p className="mt-3 leading-7">
          Your order is paid. You can track the updated order status now.
        </p>
        <Link
          href={`/track-order?reference=${encodeURIComponent(reference)}`}
          className="mt-6 inline-block rounded-full bg-neutral-950 px-6 py-4 text-sm font-semibold tracking-[0.16em] text-white uppercase hover:bg-[#a77a25]"
        >
          Track Order
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold tracking-[0.2em] text-[#a77a25] uppercase">
        Pay Online
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
        Pay With PayPal
      </h2>
      <p className="mt-3 leading-7 text-neutral-600">
        Pay securely by PayPal for order{" "}
        <strong className="text-neutral-950">{reference}</strong>. Amount:{" "}
        <strong className="text-neutral-950">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(amount)}
        </strong>
        .
      </p>

      {!clientId ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">
          PayPal sandbox credentials abhi configure nahi hain. Credentials milte
          hi `.env.local` me PayPal keys add karein, phir ye button live ho
          jayega.
        </div>
      ) : (
        <>
          <div className="mt-6 min-h-[46px]" ref={containerRef} />
          {loading && (
            <p className="mt-3 text-sm font-medium text-neutral-600">
              Processing PayPal payment...
            </p>
          )}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
