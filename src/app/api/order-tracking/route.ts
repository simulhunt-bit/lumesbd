import { NextResponse } from "next/server";
import { getOrderTrackingRecord, type OrderTrackingRecord } from "@/lib/order-tracking";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type PublicOrderTrackingRecord = Pick<
  OrderTrackingRecord,
  | "orderId"
  | "productNames"
  | "trackingId"
  | "status"
  | "confirmedAt"
  | "soonPickedUpAt"
  | "pickedUpAt"
  | "completedAt"
  | "updatedAt"
>;

const publicTrackingRecord = (record: OrderTrackingRecord): PublicOrderTrackingRecord => ({
  orderId: record.orderId,
  productNames: record.productNames,
  trackingId: record.trackingId,
  status: record.status,
  confirmedAt: record.confirmedAt,
  soonPickedUpAt: record.soonPickedUpAt,
  pickedUpAt: record.pickedUpAt,
  completedAt: record.completedAt,
  updatedAt: record.updatedAt,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId")?.trim();
  const trackingId = url.searchParams.get("trackingId")?.trim();
  const email = url.searchParams.get("email")?.trim().toLowerCase();
  const ip = getClientIp(req);
  const limit = rateLimit(`order-tracking:${ip}`, 30, 15 * 60 * 1000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many tracking lookup attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfter),
        },
      },
    );
  }

  try {
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required to load tracking details." },
        { status: 400 },
      );
    }

    if (!trackingId && !email) {
      return NextResponse.json(
        { error: "Enter the order email or tracking ID with your order ID." },
        { status: 400 },
      );
    }

    const record = await getOrderTrackingRecord(orderId);
    if (!record) {
      return NextResponse.json({ orders: [] });
    }

    const isMatchingTrackingId = Boolean(trackingId && record.trackingId === trackingId);
    const isMatchingEmail = Boolean(email && record.customerEmail.toLowerCase() === email);

    if (!isMatchingTrackingId && !isMatchingEmail) {
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: [publicTrackingRecord(record)] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load tracking details." },
      { status: 400 },
    );
  }
}
