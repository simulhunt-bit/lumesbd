import clsx from "clsx";

export const cn = (...inputs: Parameters<typeof clsx>) => clsx(inputs);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

export const districtDeliveryCharge = (district?: string) => {
  if (!district?.trim()) return 0;
  const normalized = district.trim().toLowerCase();

  if (normalized.includes("dhaka")) return 60;
  if (normalized.includes("chattogram") || normalized.includes("chittagong")) return 80;
  if (normalized.includes("rajshahi")) return 100;
  if (normalized.includes("sylhet")) return 120;
  if (normalized.includes("barisal") || normalized.includes("barishal")) return 140;
  if (normalized.includes("khulna")) return 150;
  if (normalized.includes("mymensingh")) return 160;
  if (normalized.includes("rangpur")) return 170;

  return 180;
};
