import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendAdminOrderEmail } from "@/lib/email";
import { getProducts } from "@/lib/catalog";
import { chargeableDeliveryItemCount, deliveryChargeForWeight } from "@/lib/utils";
import {
  COD_PAYMENT_METHOD,
  CUSTOMIZATION_PRICES,
  type CheckoutOrder,
  type CustomizationType,
  validateCheckoutOrder,
} from "@/lib/orders";
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
      const customization = item.customization;

      if (quantity > product.stock) {
        throw new Error(`${product.name} has only ${product.stock} available.`);
      }

      if (customization && product.subcategorySlug === "flags") {
        throw new Error("Flag add-ons cannot be customized.");
      }

      const normalizedCustomization = customization
        ? {
            type: customization.type,
            name: customization.name.trim().toUpperCase(),
            number: customization.number.trim(),
            price: CUSTOMIZATION_PRICES[customization.type as CustomizationType],
          }
        : undefined;

      if (
        normalizedCustomization &&
        (!normalizedCustomization.price ||
          !normalizedCustomization.name ||
          !normalizedCustomization.number)
      ) {
        throw new Error(`${product.name} customization requires a type, name, and number.`);
      }

      if (normalizedCustomization && !/^[\p{L}\p{N} .'-]{1,18}$/u.test(normalizedCustomization.name)) {
        throw new Error(`${product.name} customization name can use up to 18 letters or numbers.`);
      }

      if (normalizedCustomization && !/^\d{1,3}$/.test(normalizedCustomization.number)) {
        throw new Error(`${product.name} customization number must be 1 to 3 digits.`);
      }

      const unitPrice = product.price + (normalizedCustomization?.price ?? 0);

      return {
        productSlug: product.slug,
        productName: product.name,
        subcategorySlug: product.subcategorySlug,
        size: item.size,
        color: item.color,
        quantity,
        unitPrice,
        customization: normalizedCustomization,
        lineTotal: unitPrice * quantity,
      };
    });
    const flagItems = items.filter((item) => item.subcategorySlug === "flags");

    flagItems.forEach((flagItem) => {
      const country = flagItem.productSlug.replace(/-flag$/, "");
      const matchingJerseyCount = items.reduce((sum, item) => {
        if (item.subcategorySlug === "flags") return sum;

        const productName = item.productName.toLowerCase();
        const isMatchingCountry =
          item.productSlug.includes(country) || productName.includes(country);

        return sum + (isMatchingCountry ? item.quantity : 0);
      }, 0);

      if (matchingJerseyCount > 0 && flagItem.quantity > matchingJerseyCount) {
        throw new Error(`${flagItem.productName} is limited to one piece per matching jersey.`);
      }
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryItemCount = chargeableDeliveryItemCount(
      items.map((item) => ({
        quantity: item.quantity,
        isFlagAddOn: item.subcategorySlug === "flags",
      })),
    );
    const deliveryCharge = deliveryChargeForWeight(order.district, deliveryItemCount);
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
