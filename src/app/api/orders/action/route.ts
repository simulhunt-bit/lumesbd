import { NextResponse } from "next/server";
import { parseSignedAction, sendOrderStatusEmail } from "@/lib/email";
import { validateCheckoutOrder } from "@/lib/orders";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const payload = url.searchParams.get("payload");
  const signature = url.searchParams.get("signature");

  if ((action !== "confirm" && action !== "cancel") || !payload || !signature) {
    return new NextResponse("Invalid order action link.", { status: 400 });
  }

  try {
    const order = parseSignedAction(payload, action, signature);
    validateCheckoutOrder(order);
    const status = action === "confirm" ? "confirmed" : "cancelled";
    await sendOrderStatusEmail(order, status);

    return new NextResponse(
      `
        <!doctype html>
        <html>
          <head><title>Order ${status}</title></head>
          <body style="font-family:Arial,sans-serif;padding:32px;color:#18181b;">
            <h1>Order ${status}</h1>
            <p>${order.orderId} has been ${status}. Notification email sent to the customer and admin.</p>
          </body>
        </html>
      `,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Could not process order action.",
      { status: 400 },
    );
  }
}
