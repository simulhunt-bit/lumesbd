import crypto from "node:crypto";
import type { CheckoutOrder } from "@/lib/orders";

type MetaUserData = {
  em?: string[];
  ph?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
};

type MetaPurchasePayload = {
  data: Array<{
    event_name: "Purchase";
    event_time: number;
    event_id: string;
    action_source: "website";
    event_source_url?: string;
    user_data: MetaUserData;
    attribution_data?: {
      attribution_share: string;
    };
    custom_data: {
      currency: string;
      value: string;
      order_id: string;
      content_type: "product";
      contents: Array<{
        id: string;
        quantity: number;
        item_price: number;
      }>;
      num_items: number;
    };
    original_event_data: {
      event_name: "Purchase";
      event_time: number;
    };
  }>;
};

const DEFAULT_PIXEL_ID = "2417781878727667";
const DEFAULT_GRAPH_API_VERSION = "v23.0";

const cleanValue = (value: string | undefined | null) => value?.trim() ?? "";

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;

  return digits;
};

const getCookie = (req: Request, name: string) => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return "";

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : "";
};

const getClientIp = (req: Request) => {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.headers.get("x-real-ip") || "";
};

const getEventSourceUrl = (req: Request) => {
  const referer = req.headers.get("referer");
  if (referer) return referer;

  const origin = req.headers.get("origin");
  return origin ? new URL("/cart", origin).toString() : "";
};

export const buildMetaPurchasePayload = (
  order: CheckoutOrder,
  req: Request,
  eventTime = Math.floor(Date.now() / 1000),
): MetaPurchasePayload => {
  const email = cleanValue(order.customerEmail).toLowerCase();
  const phone = normalizePhone(order.customerPhone);
  const userData: MetaUserData = {
    ...(email ? { em: [sha256(email)] } : {}),
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(getClientIp(req) ? { client_ip_address: getClientIp(req) } : {}),
    ...(req.headers.get("user-agent") ? { client_user_agent: req.headers.get("user-agent")! } : {}),
    ...(getCookie(req, "_fbc") ? { fbc: getCookie(req, "_fbc") } : {}),
    ...(getCookie(req, "_fbp") ? { fbp: getCookie(req, "_fbp") } : {}),
  };
  const attributionShare = cleanValue(process.env.META_ATTRIBUTION_SHARE);

  return {
    data: [
      {
        event_name: "Purchase",
        event_time: eventTime,
        event_id: order.orderId,
        action_source: "website",
        ...(getEventSourceUrl(req) ? { event_source_url: getEventSourceUrl(req) } : {}),
        user_data: userData,
        ...(attributionShare
          ? {
              attribution_data: {
                attribution_share: attributionShare,
              },
            }
          : {}),
        custom_data: {
          currency: cleanValue(process.env.META_PURCHASE_CURRENCY) || "BDT",
          value: order.grandTotal.toFixed(2),
          order_id: order.orderId,
          content_type: "product",
          contents: order.items.map((item) => ({
            id: item.productSlug,
            quantity: item.quantity,
            item_price: item.unitPrice,
          })),
          num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
        },
        original_event_data: {
          event_name: "Purchase",
          event_time: eventTime,
        },
      },
    ],
  };
};

export async function sendMetaPurchaseEvent(order: CheckoutOrder, req: Request) {
  const accessToken = cleanValue(process.env.META_CONVERSIONS_ACCESS_TOKEN);
  const pixelId = cleanValue(process.env.META_PIXEL_ID) || cleanValue(process.env.NEXT_PUBLIC_META_PIXEL_ID) || DEFAULT_PIXEL_ID;

  if (!accessToken || !pixelId) {
    return { skipped: true, reason: "Meta Conversions API is not configured." };
  }

  const apiVersion = cleanValue(process.env.META_GRAPH_API_VERSION) || DEFAULT_GRAPH_API_VERSION;
  const url = new URL(`https://graph.facebook.com/${apiVersion}/${pixelId}/events`);
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildMetaPurchasePayload(order, req)),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Meta Conversions API failed with ${response.status}: ${details}`);
  }

  return response.json() as Promise<{ events_received?: number; messages?: string[] }>;
}
