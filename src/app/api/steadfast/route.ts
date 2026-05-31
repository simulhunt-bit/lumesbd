import { NextResponse } from "next/server";
import { sendOrderToSteadfast, steadfastReadiness, type DeliveryOrderPayload } from "@/lib/integrations/steadfast";

export async function POST(req: Request) {
  const payload = (await req.json()) as DeliveryOrderPayload;

  if (steadfastReadiness.status !== "connected") {
    return NextResponse.json(
      {
        error: "Steadfast API is not configured.",
        note: steadfastReadiness.note,
      },
      { status: 500 }
    );
  }

  try {
    const result = await sendOrderToSteadfast(payload);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error sending delivery order.",
      },
      { status: 500 }
    );
  }
}
