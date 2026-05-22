import clsx from "clsx";

export const cn = (...inputs: Parameters<typeof clsx>) => clsx(inputs);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
