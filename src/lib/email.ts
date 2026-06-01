import crypto from "node:crypto";
import nodemailer from "nodemailer";
import {
  ADMIN_EMAIL,
  type CheckoutOrder,
  formatOrderPrice,
  uniqueEmails,
} from "@/lib/orders";

type OrderAction = "confirm" | "cancel" | "picked-up" | "tracking" | "complete";

const escapeHtml = (value: string | number) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required for order email delivery.`);
  }
  return value;
};

const createTransport = () =>
  nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });

const fromAddress = () => process.env.SMTP_FROM?.trim() ?? `LUMES BD <${getRequiredEnv("SMTP_USER")}>`;

const signAction = (payload: string, action: OrderAction) =>
  crypto
    .createHmac("sha256", getRequiredEnv("ORDER_ACTION_SECRET"))
    .update(`${action}.${payload}`)
    .digest("hex");

export const createActionUrl = (origin: string, order: CheckoutOrder, action: OrderAction) => {
  const payload = Buffer.from(JSON.stringify(order), "utf8").toString("base64url");
  const signature = signAction(payload, action);
  const url = new URL("/api/orders/action", origin);
  url.searchParams.set("action", action);
  url.searchParams.set("payload", payload);
  url.searchParams.set("signature", signature);
  return url.toString();
};

export const parseSignedAction = (payload: string, action: OrderAction, signature: string) => {
  const expectedSignature = signAction(payload, action);
  const isValid =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValid) {
    throw new Error("Invalid order action signature.");
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CheckoutOrder;
};

const orderRows = (order: CheckoutOrder) =>
  order.items
    .map(
      (item) => {
        const customization = item.customizations?.length
          ? `<div style="margin-top:4px;color:#52525b;font-size:12px;">${item.customizations
              .map(
                (entry, index) =>
                  `Jersey ${index + 1}: ${escapeHtml(entry.type)} print ${escapeHtml(entry.name)} #${escapeHtml(entry.number)} (${escapeHtml(formatOrderPrice(entry.price))})`,
              )
              .join("<br />")}</div>`
          : "";

        return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e4e4e7;">${escapeHtml(item.productName)}${customization}</td>
          <td style="padding:10px;border-bottom:1px solid #e4e4e7;">${escapeHtml(item.size)}</td>
          <td style="padding:10px;border-bottom:1px solid #e4e4e7;text-align:center;">${escapeHtml(item.quantity)}</td>
          <td style="padding:10px;border-bottom:1px solid #e4e4e7;text-align:right;">${escapeHtml(formatOrderPrice(item.lineTotal))}</td>
        </tr>
      `;
      },
    )
    .join("");

const totalsBlock = (order: CheckoutOrder) => `
  <table style="width:100%;margin-top:18px;border-collapse:collapse;font-family:Arial,sans-serif;">
    <tr><td style="padding:6px 0;color:#52525b;">Subtotal</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatOrderPrice(order.subtotal))}</td></tr>
    <tr><td style="padding:6px 0;color:#52525b;">Delivery charge</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatOrderPrice(order.deliveryCharge))}</td></tr>
    <tr><td style="padding:6px 0;color:#52525b;">COD charge</td><td style="padding:6px 0;text-align:right;">${escapeHtml(formatOrderPrice(order.codCharge))}</td></tr>
    <tr><td style="padding:10px 0;font-weight:700;border-top:1px solid #d4d4d8;">Grand total</td><td style="padding:10px 0;text-align:right;font-weight:700;border-top:1px solid #d4d4d8;">${escapeHtml(formatOrderPrice(order.grandTotal))}</td></tr>
  </table>
`;

const orderDetailsHtml = (order: CheckoutOrder) => `
  <p><strong>Order ID:</strong> ${escapeHtml(order.orderId)}</p>
  <p><strong>Customer name:</strong> ${escapeHtml(order.customerName)}</p>
  <p><strong>Customer phone number:</strong> ${escapeHtml(order.customerPhone)}</p>
  <p><strong>Customer email:</strong> ${escapeHtml(order.customerEmail)}</p>
  <p><strong>Delivery address:</strong> ${escapeHtml(order.deliveryAddress)}</p>
  <p><strong>District/thana:</strong> ${escapeHtml(order.district)} / ${escapeHtml(order.thana)}</p>
  <p><strong>Payment method:</strong> ${escapeHtml(order.paymentMethod)}</p>
  <table style="width:100%;margin-top:18px;border-collapse:collapse;font-family:Arial,sans-serif;">
    <thead>
      <tr style="background:#f4f4f5;">
        <th style="padding:10px;text-align:left;">Ordered products</th>
        <th style="padding:10px;text-align:left;">Size</th>
        <th style="padding:10px;text-align:center;">Quantity</th>
        <th style="padding:10px;text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>${orderRows(order)}</tbody>
  </table>
  ${totalsBlock(order)}
`;

const emailShell = (title: string, body: string) => `
  <div style="margin:0;background:#f4f4f5;padding:24px;">
    <div style="margin:0 auto;max-width:720px;border-radius:18px;background:#ffffff;padding:28px;font-family:Arial,sans-serif;color:#18181b;">
      <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1>
      ${body}
    </div>
  </div>
`;

const orderText = (order: CheckoutOrder) => [
  `Order ID: ${order.orderId}`,
  `Customer name: ${order.customerName}`,
  `Customer phone number: ${order.customerPhone}`,
  `Customer email: ${order.customerEmail}`,
  `Delivery address: ${order.deliveryAddress}`,
  `District/thana: ${order.district} / ${order.thana}`,
  `Payment method: ${order.paymentMethod}`,
  "Ordered products:",
  ...order.items.map(
    (item) => {
      const customization = item.customizations?.length
        ? ` | ${item.customizations
            .map(
              (entry, index) =>
                `Jersey ${index + 1}: ${entry.type} print ${entry.name} #${entry.number} (${formatOrderPrice(entry.price)})`,
            )
            .join("; ")}`
        : "";

      return `- ${item.productName} | Size: ${item.size} | Qty: ${item.quantity}${customization} | ${formatOrderPrice(item.lineTotal)}`;
    },
  ),
  `Subtotal: ${formatOrderPrice(order.subtotal)}`,
  `Delivery charge: ${formatOrderPrice(order.deliveryCharge)}`,
  `COD charge: ${formatOrderPrice(order.codCharge)}`,
  `Grand total: ${formatOrderPrice(order.grandTotal)}`,
].join("\n");

export const sendAdminOrderEmail = async (order: CheckoutOrder, origin: string) => {
  const confirmUrl = createActionUrl(origin, order, "confirm");
  const cancelUrl = createActionUrl(origin, order, "cancel");
  const html = emailShell(
    `New COD order ${order.orderId}`,
    `
      ${orderDetailsHtml(order)}
      <div style="margin-top:24px;">
        <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;margin-right:10px;border-radius:999px;background:#16a34a;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Confirm Order</a>
        <a href="${escapeHtml(cancelUrl)}" style="display:inline-block;border-radius:999px;background:#dc2626;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Cancel Order</a>
      </div>
    `,
  );

  await createTransport().sendMail({
    from: fromAddress(),
    to: ADMIN_EMAIL,
    subject: `New COD order ${order.orderId}`,
    text: `${orderText(order)}\n\nConfirm Order: ${confirmUrl}\nCancel Order: ${cancelUrl}`,
    html,
  });
};

export const sendOrderStatusEmail = async (
  order: CheckoutOrder,
  status: "confirmed" | "cancelled",
) => {
  const isConfirmed = status === "confirmed";
  const title = isConfirmed ? `Order confirmed ${order.orderId}` : `Order cancelled ${order.orderId}`;
  const intro = isConfirmed
    ? "Your Cash on Delivery order has been confirmed."
    : "Your Cash on Delivery order has been cancelled.";

  await createTransport().sendMail({
    from: fromAddress(),
    to: uniqueEmails([order.customerEmail, ADMIN_EMAIL]),
    subject: title,
    text: `${intro}\n\n${orderText(order)}`,
    html: emailShell(title, `<p>${escapeHtml(intro)}</p>${orderDetailsHtml(order)}`),
  });
};

export const sendAdminTrackingRequestEmail = async (order: CheckoutOrder, origin: string) => {
  const trackingUrl = createActionUrl(origin, order, "tracking");
  const html = emailShell(
    `Add tracking for ${order.orderId}`,
    `
      <p>The order is confirmed. Add the courier tracking ID once the order is picked up.</p>
      ${orderDetailsHtml(order)}
      <div style="margin-top:24px;">
        <a href="${escapeHtml(trackingUrl)}" style="display:inline-block;border-radius:999px;background:#18181b;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Add Tracking ID</a>
      </div>
    `,
  );

  await createTransport().sendMail({
    from: fromAddress(),
    to: ADMIN_EMAIL,
    subject: `Add tracking ID for ${order.orderId}`,
    text: `${orderText(order)}\n\nAdd Tracking ID: ${trackingUrl}`,
    html,
  });
};

export const sendAdminPickedUpRequestEmail = async (order: CheckoutOrder, origin: string) => {
  const pickedUpUrl = createActionUrl(origin, order, "picked-up");
  const html = emailShell(
    `Mark picked up for ${order.orderId}`,
    `
      <p>The order is confirmed and is now shown to the customer as soon picked up. Click once the parcel is picked up from LUMES BD.</p>
      ${orderDetailsHtml(order)}
      <div style="margin-top:24px;">
        <a href="${escapeHtml(pickedUpUrl)}" style="display:inline-block;border-radius:999px;background:#0891b2;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Picked Up</a>
      </div>
    `,
  );

  await createTransport().sendMail({
    from: fromAddress(),
    to: ADMIN_EMAIL,
    subject: `Picked up from us? ${order.orderId}`,
    text: `${orderText(order)}\n\nPicked Up: ${pickedUpUrl}`,
    html,
  });
};

export const sendOrderPickedUpEmail = async (order: CheckoutOrder, origin: string) => {
  const trackingUrl = new URL("/track-order", origin);
  trackingUrl.searchParams.set("orderId", order.orderId);
  if (order.trackingId) {
    trackingUrl.searchParams.set("trackingId", order.trackingId);
  }

  const intro = "Your Cash on Delivery order has been picked up from us and will be delivered soon.";

  await createTransport().sendMail({
    from: fromAddress(),
    to: uniqueEmails([order.customerEmail, ADMIN_EMAIL]),
    subject: `Order picked up ${order.orderId}`,
    text: [
      intro,
      "",
      orderText(order),
      `Tracking ID: ${order.trackingId ?? "Pending"}`,
      `Track Order: ${trackingUrl.toString()}`,
    ].join("\n"),
    html: emailShell(
      `Order picked up ${order.orderId}`,
      `
        <p>${escapeHtml(intro)}</p>
        <p><strong>Tracking ID:</strong> ${escapeHtml(order.trackingId ?? "Pending")}</p>
        <p><a href="${escapeHtml(trackingUrl.toString())}" style="color:#0891b2;font-weight:700;">Track your order</a></p>
        ${orderDetailsHtml(order)}
      `,
    ),
  });
};

export const sendAdminCompletionRequestEmail = async (order: CheckoutOrder, origin: string) => {
  const completeUrl = createActionUrl(origin, order, "complete");
  const html = emailShell(
    `Complete order ${order.orderId}`,
    `
      <p>The customer has been notified with tracking details.</p>
      <p><strong>Tracking ID:</strong> ${escapeHtml(order.trackingId ?? "Pending")}</p>
      <div style="margin-top:24px;">
        <a href="${escapeHtml(completeUrl)}" style="display:inline-block;border-radius:999px;background:#16a34a;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">Order Completed</a>
      </div>
    `,
  );

  await createTransport().sendMail({
    from: fromAddress(),
    to: ADMIN_EMAIL,
    subject: `Mark order completed ${order.orderId}`,
    text: `${orderText(order)}\n\nTracking ID: ${order.trackingId ?? "Pending"}\nOrder Completed: ${completeUrl}`,
    html,
  });
};

export const sendOrderCompletedEmail = async (order: CheckoutOrder) => {
  const intro = "Thank you for your order. Your LUMES BD order has been completed.";

  await createTransport().sendMail({
    from: fromAddress(),
    to: uniqueEmails([order.customerEmail, ADMIN_EMAIL]),
    subject: `Order completed ${order.orderId}`,
    text: `${intro}\n\n${orderText(order)}`,
    html: emailShell(
      `Order completed ${order.orderId}`,
      `<p>${escapeHtml(intro)}</p><p>We appreciate you shopping with LUMES BD.</p>${orderDetailsHtml(order)}`,
    ),
  });
};

export const sendWishlistDemandEmail = async ({
  productName,
  size,
  totalCount,
  milestone,
  users,
}: {
  productName: string;
  size: string;
  totalCount: number;
  milestone: number;
  users: Array<{ displayName: string; email: string }>;
}) => {
  const userRows = users
    .slice(-10)
    .map(
      (user) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e4e4e7;">${escapeHtml(user.displayName || "LUMES Customer")}</td>
          <td style="padding:8px;border-bottom:1px solid #e4e4e7;">${escapeHtml(user.email || "No email")}</td>
        </tr>
      `,
    )
    .join("");
  const html = emailShell(
    `Wishlist demand reached ${milestone}`,
    `
      <p><strong>Product:</strong> ${escapeHtml(productName)}</p>
      <p><strong>Size:</strong> ${escapeHtml(size)}</p>
      <p><strong>Total wishlist demand:</strong> ${escapeHtml(totalCount)}</p>
      <table style="width:100%;margin-top:18px;border-collapse:collapse;font-family:Arial,sans-serif;">
        <thead>
          <tr style="background:#f4f4f5;">
            <th style="padding:8px;text-align:left;">Recent users</th>
            <th style="padding:8px;text-align:left;">Email</th>
          </tr>
        </thead>
        <tbody>${userRows}</tbody>
      </table>
    `,
  );
  const text = [
    `Wishlist demand reached ${milestone}`,
    `Product: ${productName}`,
    `Size: ${size}`,
    `Total wishlist demand: ${totalCount}`,
    "Recent users:",
    ...users.slice(-10).map((user) => `- ${user.displayName || "LUMES Customer"} | ${user.email || "No email"}`),
  ].join("\n");

  await createTransport().sendMail({
    from: fromAddress(),
    to: ADMIN_EMAIL,
    subject: `Wishlist demand: ${productName} size ${size} reached ${milestone}`,
    text,
    html,
  });
};
