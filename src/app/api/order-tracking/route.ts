import { NextResponse } from "next/server";
import { getOrderTrackingRecord, listOrderTrackingRecords } from "@/lib/order-tracking";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId")?.trim();
  const trackingId = url.searchParams.get("trackingId")?.trim();
  const email = url.searchParams.get("email")?.trim().toLowerCase();

  try {
    if (orderId) {
      const record = await getOrderTrackingRecord(orderId);
      const isMatchingTrackingId = !trackingId || record?.trackingId === trackingId;

      return NextResponse.json({
        orders: record && isMatchingTrackingId ? [record] : [],
      });
    }

    if (email) {
      const orders = (await listOrderTrackingRecords())
        .filter((record) => record.customerEmail.toLowerCase() === email)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

      return NextResponse.json({ orders });
    }

    return NextResponse.json({ orders: [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load tracking details." },
      { status: 400 },
    );
  }
}
