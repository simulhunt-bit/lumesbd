import { NextResponse } from "next/server";
import {
  createActionUrl,
  parseSignedAction,
  sendAdminCompletionRequestEmail,
  sendAdminPickedUpRequestEmail,
  sendAdminTrackingRequestEmail,
  sendOrderCompletedEmail,
  sendOrderPickedUpEmail,
  sendOrderStatusEmail,
} from "@/lib/email";
import { extractSteadfastTrackingId, sendOrderToSteadfast } from "@/lib/integrations/steadfast";
import { buildTrackingRecord, saveOrderTrackingRecord } from "@/lib/order-tracking";
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

  if (
    (action !== "confirm" &&
      action !== "cancel" &&
      action !== "picked-up" &&
      action !== "tracking" &&
      action !== "complete") ||
    !payload ||
    !signature
  ) {
    return new NextResponse("Invalid order action link.", { status: 400 });
  }

  try {
    const order = parseSignedAction(payload, action, signature);
    validateCheckoutOrder(order);

    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > ACTION_LINK_MAX_AGE_MS) {
      return new NextResponse("This order action link has expired.", { status: 410 });
    }

    if (action === "tracking") {
      return new NextResponse(
        `
          <!doctype html>
          <html>
            <head><title>Add tracking ID</title></head>
            <body style="font-family:Arial,sans-serif;padding:32px;color:#18181b;">
              <h1>Add tracking ID</h1>
              <p>Order ${order.orderId}</p>
              <form method="post" action="/api/orders/action" style="margin-top:24px;max-width:420px;">
                <input type="hidden" name="action" value="tracking" />
                <input type="hidden" name="payload" value="${payload}" />
                <input type="hidden" name="signature" value="${signature}" />
                <label style="display:block;font-weight:700;margin-bottom:8px;" for="trackingId">Courier tracking ID</label>
                <input id="trackingId" name="trackingId" required minlength="3" maxlength="80" style="box-sizing:border-box;width:100%;border:1px solid #d4d4d8;border-radius:12px;padding:12px;font-size:16px;" />
                <button type="submit" style="margin-top:16px;border:0;border-radius:999px;background:#18181b;color:white;padding:12px 18px;font-weight:700;cursor:pointer;">Picked from us</button>
              </form>
            </body>
          </html>
        `,
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      );
    }

    if (action === "complete") {
      const completedOrder = { ...order, completedAt: new Date().toISOString() };
      await saveOrderTrackingRecord(buildTrackingRecord(completedOrder, "completed"));
      await sendOrderCompletedEmail(completedOrder);

      return renderActionPage("Order completed", `${order.orderId} has been completed. Thank-you email sent to the customer.`);
    }

    if (action === "picked-up") {
      const origin = new URL(req.url).origin;
      let pickedUpOrder = {
        ...order,
        pickedUpAt: new Date().toISOString(),
      };

      await saveOrderTrackingRecord(buildTrackingRecord(pickedUpOrder, "picked_up_from_us"));

      try {
        const steadfastResult = await sendOrderToSteadfast(order);
        const trackingId = extractSteadfastTrackingId(steadfastResult);

        if (!trackingId) {
          throw new Error("Steadfast did not return a tracking ID or consignment ID.");
        }

        pickedUpOrder = {
          ...pickedUpOrder,
          trackingId,
        };

        await saveOrderTrackingRecord(buildTrackingRecord(pickedUpOrder, "picked_up_from_us"));
        await sendOrderPickedUpEmail(pickedUpOrder, origin);
        await sendAdminCompletionRequestEmail(pickedUpOrder, origin);

        return renderActionPage(
          "Order picked up",
          `${order.orderId} is now marked as picked up from us. Steadfast parcel created with tracking ID ${trackingId}. Customer delivery-soon email and admin completion request sent.`,
        );
      } catch (steadfastError) {
        await sendOrderPickedUpEmail(pickedUpOrder, origin);
        await sendAdminTrackingRequestEmail(pickedUpOrder, origin);

        return renderActionPage(
          "Order picked up",
          `${order.orderId} is now marked as picked up from us, but Steadfast parcel creation failed: ${
            steadfastError instanceof Error ? steadfastError.message : "Unknown Steadfast error"
          }. Customer delivery-soon email sent and manual tracking request sent to admin.`,
        );
      }
    }

    const status = action === "confirm" ? "confirmed" : "cancelled";
    await sendOrderStatusEmail(order, status);

    if (action === "confirm") {
      const origin = new URL(req.url).origin;
      const pickedUpUrl = createActionUrl(origin, order, "picked-up");
      await saveOrderTrackingRecord(buildTrackingRecord(order, "soon_picked_up"));
      await sendAdminPickedUpRequestEmail(order, origin);

      return renderActionPage(
        "Order confirmed",
        `${order.orderId} has been confirmed and is now shown as soon picked up. Picked Up request sent to admin. <a href="${pickedUpUrl}">Open Picked Up action</a>.`,
      );
    }

    return renderActionPage(
      `Order ${status}`,
      `${order.orderId} has been ${status}. Notification email sent.`,
    );
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Could not process order action.",
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const action = String(formData.get("action") ?? "");
  const payload = String(formData.get("payload") ?? "");
  const signature = String(formData.get("signature") ?? "");
  const trackingId = String(formData.get("trackingId") ?? "").trim();

  if (action !== "tracking" || !payload || !signature || !trackingId) {
    return new NextResponse("Invalid tracking submission.", { status: 400 });
  }

  try {
    const order = parseSignedAction(payload, "tracking", signature);
    validateCheckoutOrder(order);

    const createdAt = Date.parse(order.createdAt);
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > ACTION_LINK_MAX_AGE_MS) {
      return new NextResponse("This order action link has expired.", { status: 410 });
    }

    if (!/^[\p{L}\p{N} ._:/#-]{3,80}$/u.test(trackingId)) {
      return new NextResponse("Tracking ID must be 3 to 80 characters.", { status: 400 });
    }

    const pickedUpOrder = {
      ...order,
      trackingId,
      pickedUpAt: new Date().toISOString(),
    };
    const origin = new URL(req.url).origin;
    await saveOrderTrackingRecord(buildTrackingRecord(pickedUpOrder, "picked_up_from_us"));
    await sendOrderPickedUpEmail(pickedUpOrder, origin);
    await sendAdminCompletionRequestEmail(pickedUpOrder, origin);

    return renderActionPage(
      "Tracking submitted",
      `Tracking ID ${trackingId} was sent to the customer. Completion email sent to admin.`,
    );
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Could not submit tracking ID.",
      { status: 400 },
    );
  }
}

const renderActionPage = (title: string, message: string) =>
  new NextResponse(
    `
      <!doctype html>
      <html>
        <head><title>${title}</title></head>
        <body style="font-family:Arial,sans-serif;padding:32px;color:#18181b;">
          <h1>${title}</h1>
          <p>${message}</p>
        </body>
      </html>
    `,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
