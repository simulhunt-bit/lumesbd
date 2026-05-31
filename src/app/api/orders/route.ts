import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendAdminOrderEmail } from "@/lib/email";
import { getProducts } from "@/lib/catalog";
import { deliveryChargeForWeight } from "@/lib/utils";
import { COD_PAYMENT_METHOD, type CheckoutOrder, validateCheckoutOrder } from "@/lib/orders";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_ORDER_BODY_BYTES = 20_000;

const readJsonBody = async (req: Request) => {
  const body = await req.text();

  if (body.length > MAX_ORDER_BODY_BYTES) {
    throw new Error("Order request is too large.");
  }

  return JSON.parse(body) as CheckoutOrder;
};

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    const requestOrigin = new URL(req.url).origin;

    if (origin && origin !== requestOrigin) {
      return NextResponse.json({ error: "Invalid order origin." }, { status: 403 });
    }

    const ip = getClientIp(req);
    const limit = rateLimit(`orders:${ip}`, 5, 15 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many order attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.retryAfter),
          },
        },
      );
    }

    const order = await readJsonBody(req);
    const products = getProducts();
    const items = order.items.map((item) => {
      const product = products.find((entry) => entry.slug === item.productSlug);

      if (!product) {
        throw new Error(`Product ${item.productName || item.productSlug} is not available.`);
      }

      if (!product.sizes.includes(item.size as (typeof product.sizes)[number])) {
        throw new Error(`${product.name} is not available in size ${item.size}.`);
      }

      if (!product.colors.some((color) => color.name === item.color)) {
        throw new Error(`${product.name} is not available in color ${item.color}.`);
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      if (quantity > product.stock) {
        throw new Error(`${product.name} has only ${product.stock} available.`);
      }

      return {
        productSlug: product.slug,
        productName: product.name,
        size: item.size,
        color: item.color,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryCharge = deliveryChargeForWeight(order.district, totalItems);
    const normalizedOrder: CheckoutOrder = {
      ...order,
      orderId: `LUMES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      items,
      subtotal,
      deliveryCharge,
      vat: 0,
      grandTotal: subtotal + deliveryCharge,
      createdAt: new Date().toISOString(),
      paymentMethod: COD_PAYMENT_METHOD,
    };

    validateCheckoutOrder(normalizedOrder);
    await sendAdminOrderEmail(normalizedOrder, new URL(req.url).origin);

    return NextResponse.json({ success: true, orderId: normalizedOrder.orderId });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not place order.",
      },
      { status: 400 },
    );
  }
}
