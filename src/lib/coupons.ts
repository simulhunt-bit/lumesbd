export type DiscountType = "fixed" | "percentage";
export type DiscountTarget = "delivery" | "subtotal" | "grandtotal";

export type Coupon = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountTarget: DiscountTarget;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  description?: string;
};

// Available coupons in the system
export const AVAILABLE_COUPONS: Record<string, Coupon> = {
  fifa2026: {
    code: "fifa2026",
    discountType: "percentage",
    discountValue: 50,
    discountTarget: "delivery",
    isActive: true,
    currentUses: 0,
    startsAt: "2026-06-08T00:00:00Z",
    expiresAt: "2026-06-26T12:00:00Z",
    description: "50% off on delivery charges",
  },
};

export const getCoupon = (code: string): Coupon | null => {
  const normalizedCode = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[normalizedCode.toLowerCase()];

  if (!coupon) {
    return null;
  }

  return coupon;
};

export const validateCoupon = (coupon: Coupon): { valid: boolean; reason?: string } => {
  if (!coupon.isActive) {
    return { valid: false, reason: "This coupon is not active." };
  }

  if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
    return { valid: false, reason: "This coupon is not yet valid." };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, reason: "This coupon has expired." };
  }

  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return { valid: false, reason: "This coupon has reached its maximum uses." };
  }

  return { valid: true };
};

export const calculateDiscount = (
  coupon: Coupon,
  baseAmount: number,
): number => {
  if (coupon.discountType === "percentage") {
    return Math.floor((baseAmount * coupon.discountValue) / 100);
  } else {
    return Math.min(coupon.discountValue, baseAmount);
  }
};

export const applyCoupon = (
  coupon: Coupon,
  subtotal: number,
  deliveryCharge: number,
): { discount: number; newDeliveryCharge?: number; newSubtotal?: number } => {
  if (coupon.discountTarget === "delivery") {
    const discount = calculateDiscount(coupon, deliveryCharge);
    return { discount, newDeliveryCharge: deliveryCharge - discount };
  } else if (coupon.discountTarget === "subtotal") {
    const discount = calculateDiscount(coupon, subtotal);
    return { discount, newSubtotal: subtotal - discount };
  } else {
    const totalAmount = subtotal + deliveryCharge;
    const discount = calculateDiscount(coupon, totalAmount);
    return { discount };
  }
};
