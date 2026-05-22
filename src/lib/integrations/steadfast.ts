export type DeliveryOrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  district: string;
  productNames: string[];
  amount: number;
};

export const steadfastReadiness = {
  status: "not-connected",
  note: "This project includes a placeholder contract for future Steadfast API integration. Add a server-side route or external function before sending live delivery requests.",
};

export const mapOrderToSteadfastPayload = (payload: DeliveryOrderPayload) => payload;
