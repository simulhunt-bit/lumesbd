export const ADMIN_EMAIL = "lumesbd@gmail.com";
export const COD_PAYMENT_METHOD = "Cash on Delivery";

export type CheckoutOrderItem = {
  productSlug: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutOrder = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  district: string;
  thana: string;
  items: CheckoutOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  vat: number;
  grandTotal: number;
  paymentMethod: typeof COD_PAYMENT_METHOD;
  createdAt: string;
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const uniqueEmails = (emails: string[]) => {
  const seen = new Set<string>();

  return emails
    .map((email) => email.trim())
    .filter((email) => {
      const normalized = normalizeEmail(email);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

export const formatOrderPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

export const validateCheckoutOrder = (order: CheckoutOrder) => {
  const requiredFields = [
    order.orderId,
    order.customerName,
    order.customerPhone,
    order.customerEmail,
    order.deliveryAddress,
    order.district,
    order.thana,
  ];

  if (requiredFields.some((field) => !field?.trim())) {
    throw new Error("Customer name, phone, email, delivery address, district, and thana are required.");
  }

  if (order.paymentMethod !== COD_PAYMENT_METHOD) {
    throw new Error("Only Cash on Delivery orders are supported.");
  }

  if (!order.items.length) {
    throw new Error("At least one product is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.customerEmail)) {
    throw new Error("A valid customer email is required.");
  }
};
