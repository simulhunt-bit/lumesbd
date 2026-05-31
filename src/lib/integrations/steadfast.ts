import type { CheckoutOrder } from "@/lib/orders";

export type DeliveryOrderPayload = {
  orderId?: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  address: string;
  district: string;
  thana?: string;
  productNames: string[];
  amount: number;
  paymentMethod?: string;
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
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  recipient_email?: string;
  note: string;
  item_description: string;
  total_lot: number;
  delivery_type: 0;
};

export const mapOrderToSteadfastPayload = (payload: DeliveryOrderPayload): SteadfastApiPayload => ({
  invoice: payload.orderId ?? `LUMES-${Date.now()}`,
  recipient_name: payload.customerName,
  recipient_phone: payload.phone,
  recipient_address: [payload.address, payload.thana, payload.district].filter(Boolean).join(", "),
  cod_amount: payload.amount,
  recipient_email: payload.customerEmail,
  note: [
    `Payment: ${payload.paymentMethod ?? "Cash on Delivery"}`,
    `District: ${payload.district}`,
    payload.thana ? `Thana: ${payload.thana}` : "",
  ].filter(Boolean).join(" | "),
  item_description: payload.productNames.join(", "),
  total_lot: Math.max(1, payload.productNames.length),
  delivery_type: 0,
});

export const mapCheckoutOrderToDeliveryPayload = (order: CheckoutOrder): DeliveryOrderPayload => ({
  orderId: order.orderId,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  phone: order.customerPhone,
  address: order.deliveryAddress,
  district: order.district,
  thana: order.thana,
  productNames: order.items.map((item) => `${item.productName} x${item.quantity} (${item.size})`),
  amount: order.grandTotal,
  paymentMethod: order.paymentMethod,
});

type SteadfastResponseValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SteadfastResponseValue[]
  | { [key: string]: SteadfastResponseValue };

export const extractSteadfastTrackingId = (response: unknown): string | null => {
  const preferredKeys = [
    "tracking_code",
    "trackingCode",
    "tracking_id",
    "trackingId",
    "consignment_id",
    "consignmentId",
    "consignment_no",
    "consignmentNo",
    "id",
  ];

  const visit = (value: SteadfastResponseValue): string | null => {
    if (!value || typeof value !== "object") return null;

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = visit(item);
        if (found) return found;
      }
      return null;
    }

    for (const key of preferredKeys) {
      const candidate = value[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
      if (typeof candidate === "number" && Number.isFinite(candidate)) return String(candidate);
    }

    for (const nested of Object.values(value)) {
      const found = visit(nested);
      if (found) return found;
    }

    return null;
  };

  return visit(response as SteadfastResponseValue);
};

export async function sendOrderToSteadfast(payload: DeliveryOrderPayload | CheckoutOrder) {
  const url = process.env.STEADFAST_API_URL;
  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;

  if (!url || !apiKey || !secretKey) {
    throw new Error(
      "Steadfast API is not configured. Set STEADFAST_API_URL, STEADFAST_API_KEY, and STEADFAST_SECRET_KEY."
    );
  }

  const deliveryPayload = "customerPhone" in payload ? mapCheckoutOrderToDeliveryPayload(payload) : payload;
  const body = JSON.stringify(mapOrderToSteadfastPayload(deliveryPayload));
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
