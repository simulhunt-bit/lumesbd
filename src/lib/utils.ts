import clsx from "clsx";

export const cn = (...inputs: Parameters<typeof clsx>) => clsx(inputs);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

export const MAX_DELIVERY_CHARGE = 160;

export const districtDeliveryCharge = (district?: string) => {
  if (!district?.trim()) return 0;
  const normalized = district.trim().toLowerCase();

  if (normalized.includes("dhaka")) return 60;
  if (normalized.includes("chattogram") || normalized.includes("chittagong")) return 80;
  if (normalized.includes("rajshahi")) return 100;
  if (normalized.includes("sylhet")) return 120;
  if (normalized.includes("barisal") || normalized.includes("barishal")) return 140;
  if (normalized.includes("khulna")) return 150;

  return MAX_DELIVERY_CHARGE;
};

export const JERSEY_WEIGHT_GRAMS = 400;
export const FLAG_WEIGHT_GRAMS = 100;

export const deliveryWeightForItems = (
  items: { quantity: number; isFlag?: boolean }[],
) =>
  items.reduce(
    (sum, item) =>
      sum + item.quantity * (item.isFlag ? FLAG_WEIGHT_GRAMS : JERSEY_WEIGHT_GRAMS),
    0,
  );

export const deliveryChargeForWeight = (district?: string, weightGrams = 0) => {
  if (!district?.trim() || weightGrams <= 0) return 0;
  const baseCharge = districtDeliveryCharge(district);
  const packageCount = Math.max(1, Math.ceil(weightGrams / 1000));
  return Math.min(baseCharge * packageCount, MAX_DELIVERY_CHARGE);
};
