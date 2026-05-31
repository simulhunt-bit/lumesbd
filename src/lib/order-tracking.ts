import type { CheckoutOrder } from "@/lib/orders";

export type TrackingStatus = "confirmed" | "picked_up" | "completed";

export type OrderTrackingRecord = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productNames: string[];
  trackingId?: string;
  status: TrackingStatus;
  confirmedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  updatedAt: string;
};

const databaseUrl = () => process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.replace(/\/$/, "");

const authQuery = () => {
  const secret = process.env.FIREBASE_DATABASE_SECRET?.trim();
  return secret ? `?auth=${encodeURIComponent(secret)}` : "";
};

const encodeKey = (value: string) => Buffer.from(value, "utf8").toString("base64url");

const trackingPath = (orderId: string) => `orderTracking/${encodeKey(orderId)}`;

const firebaseRest = async <T>(path: string, init?: RequestInit) => {
  const baseUrl = databaseUrl();
  if (!baseUrl) {
    throw new Error("Firebase Realtime Database URL is not configured.");
  }

  const response = await fetch(`${baseUrl}/${path}.json${authQuery()}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Could not update order tracking.");
  }

  return (await response.json()) as T;
};

export const buildTrackingRecord = (
  order: CheckoutOrder,
  status: TrackingStatus,
): OrderTrackingRecord => ({
  orderId: order.orderId,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  productNames: order.items.map((item) => item.productName),
  trackingId: order.trackingId,
  status,
  confirmedAt: status === "confirmed" ? new Date().toISOString() : undefined,
  pickedUpAt: order.pickedUpAt,
  completedAt: order.completedAt,
  updatedAt: new Date().toISOString(),
});

export const saveOrderTrackingRecord = async (record: OrderTrackingRecord) => {
  const existing = await getOrderTrackingRecord(record.orderId);
  const nextRecord = {
    ...existing,
    ...record,
    confirmedAt: record.confirmedAt ?? existing?.confirmedAt,
    pickedUpAt: record.pickedUpAt ?? existing?.pickedUpAt,
    completedAt: record.completedAt ?? existing?.completedAt,
  };

  await firebaseRest(trackingPath(record.orderId), {
    method: "PUT",
    body: JSON.stringify(nextRecord),
  });
};

export const getOrderTrackingRecord = async (orderId: string) =>
  firebaseRest<OrderTrackingRecord | null>(trackingPath(orderId));

export const listOrderTrackingRecords = async () => {
  const records = await firebaseRest<Record<string, OrderTrackingRecord> | null>("orderTracking");
  return Object.values(records ?? {});
};
