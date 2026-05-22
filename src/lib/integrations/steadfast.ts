export type DeliveryOrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  district: string;
  productNames: string[];
  amount: number;
};

const isSteadfastConfigured = Boolean(
  process.env.STEADFAST_API_URL && process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY
);

export const steadfastReadiness = {
  status: isSteadfastConfigured ? "connected" : "not-connected",
  note: isSteadfastConfigured
    ? "Steadfast API is configured and ready. Send delivery orders through /api/steadfast."
    : "Configure STEADFAST_API_URL, STEADFAST_API_KEY, and STEADFAST_SECRET_KEY in your environment before sending live delivery requests.",
};

export type SteadfastApiPayload = {
  customer_name: string;
  phone: string;
  address: string;
  district: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total_amount: number;
};

export const mapOrderToSteadfastPayload = (payload: DeliveryOrderPayload): SteadfastApiPayload => ({
  customer_name: payload.customerName,
  phone: payload.phone,
  address: payload.address,
  district: payload.district,
  items: payload.productNames.map((name) => ({ name, quantity: 1, price: Math.round(payload.amount / payload.productNames.length) })),
  total_amount: payload.amount,
});

export async function sendOrderToSteadfast(payload: DeliveryOrderPayload) {
  const url = process.env.STEADFAST_API_URL;
  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;

  if (!url || !apiKey || !secretKey) {
    throw new Error(
      "Steadfast API is not configured. Set STEADFAST_API_URL, STEADFAST_API_KEY, and STEADFAST_SECRET_KEY."
    );
  }

  const body = JSON.stringify(mapOrderToSteadfastPayload(payload));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
      "Secret-Key": secretKey,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Steadfast API request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as unknown;
}
