import { NextResponse } from "next/server";
import { parseSignedAction, sendOrderStatusEmail } from "@/lib/email";
import { validateCheckoutOrder } from "@/lib/orders";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const ACTION_LINK_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const payload = url.searchParams.get("payload");
  const signature = url.searchParams.get("signature");
  const ip = getClientIp(req);
  const limit = rateLimit(`order-action:${ip}`, 20, 15 * 60 * 1000);

  if (!limit.allowed) {
    return new NextResponse("Too many order action attempts. Please try again later.", {
      status: 429,
      headers: {
        "Retry-After": String(limit.retryAfter),
      },
    });
  }

  if ((action !== "confirm" && action !== "cancel") || !payload || !signature) {
    return new NextResponse("Invalid order action link.", { status: 400 });
  }

  try {
    const order = parseSignedAction(payload, action, signature);
    validateCheckoutOrder(order);

    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > ACTION_LINK_MAX_AGE_MS) {
      return new NextResponse("This order action link has expired.", { status: 410 });
    }

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
