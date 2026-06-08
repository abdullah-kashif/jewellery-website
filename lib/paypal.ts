import "server-only";

export type PayPalOrder = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    custom_id?: string;
    description?: string;
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string;
        amount?: {
          currency_code?: string;
          value?: string;
        };
      }>;
    };
  }>;
};

function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function getPayPalCredentials() {
  const clientId =
    process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured yet.");
  }

  return { clientId, clientSecret };
}

export function isPayPalConfigured() {
  return Boolean(
    (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
      process.env.PAYPAL_CLIENT_SECRET
  );
}

export async function getPayPalAccessToken() {
  const { clientId, clientSecret } = getPayPalCredentials();

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Failed to connect PayPal.");
  }

  return String(data.access_token || "");
}

export async function createPayPalOrder(input: {
  orderId: string;
  reference: string;
  amount: number;
  currency?: string;
}) {
  const accessToken = await getPayPalAccessToken();
  const currency = input.currency || "USD";

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.orderId,
          description: `LUXORA order ${input.reference}`,
          amount: {
            currency_code: currency,
            value: input.amount.toFixed(2),
          },
        },
      ],
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as PayPalOrder & {
    message?: string;
    details?: Array<{ issue?: string; description?: string }>;
  };

  if (!response.ok || !data.id) {
    const detail = data.details?.[0]?.description;
    throw new Error(detail || data.message || "Failed to create PayPal order.");
  }

  return data;
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = (await response.json()) as PayPalOrder & {
    message?: string;
    details?: Array<{ issue?: string; description?: string }>;
  };

  if (!response.ok) {
    const detail = data.details?.[0]?.description;
    throw new Error(detail || data.message || "Failed to capture PayPal order.");
  }

  return data;
}
