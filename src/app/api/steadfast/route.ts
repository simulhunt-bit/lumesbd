import { NextResponse } from "next/server";
import nodeCrypto from "node:crypto";
import { sendOrderToSteadfast, steadfastReadiness, type DeliveryOrderPayload } from "@/lib/integrations/steadfast";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 12_000;

const timingSafeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && nodeCrypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const apiSecret = () => process.env.STEADFAST_ENDPOINT_SECRET?.trim() || process.env.ORDER_ACTION_SECRET?.trim();

const readJsonBody = async (req: Request) => {
  const body = await req.text();
  if (body.length > MAX_BODY_BYTES) {
    throw new Error("Delivery request is too large.");
  }

  return JSON.parse(body) as Partial<DeliveryOrderPayload>;
};

const validatePayload = (payload: Partial<DeliveryOrderPayload>): DeliveryOrderPayload => {
  const requiredStrings = [
    payload.customerName,
    payload.phone,
    payload.address,
    payload.district,
  ];

  if (requiredStrings.some((value) => !value?.trim())) {
    throw new Error("Customer name, phone, address, and district are required.");
  }

  if (!Array.isArray(payload.productNames) || payload.productNames.length === 0) {
    throw new Error("At least one product is required.");
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("A valid COD amount is required.");
  }

  const productNames = payload.productNames.map((name) => String(name).trim()).filter(Boolean).slice(0, 25);
  if (!productNames.length) {
    throw new Error("At least one product is required.");
  }

  return {
    orderId: payload.orderId?.trim(),
    customerName: payload.customerName!.trim(),
    customerEmail: payload.customerEmail?.trim(),
    phone: payload.phone!.trim(),
    address: payload.address!.trim(),
    district: payload.district!.trim(),
    thana: payload.thana?.trim(),
    productNames,
    amount,
    paymentMethod: payload.paymentMethod?.trim(),
  };
};

export async function POST(req: Request) {
  const secret = apiSecret();
  const authorization = req.headers.get("authorization")?.trim();
  const providedSecret = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";
  const ip = getClientIp(req);
  const limit = rateLimit(`steadfast:${ip}`, 20, 15 * 60 * 1000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many delivery API attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfter),
        },
      },
    );
  }

  if (!secret || !providedSecret || !timingSafeEqual(providedSecret, secret)) {
    return NextResponse.json({ error: "Unauthorized delivery request." }, { status: 401 });
  }

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
    const payload = validatePayload(await readJsonBody(req));
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
