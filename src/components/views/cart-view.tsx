"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { getProducts } from "@/lib/catalog";
import { formatPrice, deliveryChargeForWeight, VAT_CHARGE } from "@/lib/utils";
import { COD_PAYMENT_METHOD, type CheckoutOrder } from "@/lib/orders";

type CartItem = {
  id: string;
  slug: string;
  quantity: number;
  size: string;
  color: string;
};

type CartProduct = {
  item: CartItem;
  product: ReturnType<typeof getProducts>[number];
};

export function CartView() {
  const { cart, clearCart, removeFromCart, updateCartQuantity } = useShop();
  const { profile } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    district: "",
    thana: "",
  });
  const [orderStatus, setOrderStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [orderMessage, setOrderMessage] = useState("");
  const cartProducts = cart
    .map((item) => {
      const product = getProducts().find((entry) => entry.slug === item.slug);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as CartProduct[];

  const total = cartProducts.reduce((sum, entry) => sum + entry.product.price * entry.item.quantity, 0);
  const totalItems = cartProducts.reduce((sum, entry) => sum + entry.item.quantity, 0);

  const savedAddresses = profile?.addresses.filter((address) => address.district.trim()) ?? [];
  const defaultAddress = savedAddresses.find((address) => address.isDefault) ?? savedAddresses[0];
  const selectedAddress =
    savedAddresses.find((address) => address.id === selectedAddressId) ??
    defaultAddress;
  const activeCheckoutDetails = {
    customerName:
      checkoutDetails.customerName || selectedAddress?.fullName || profile?.displayName || "",
    customerPhone:
      checkoutDetails.customerPhone || selectedAddress?.phoneNumber || profile?.phoneNumber || "",
    customerEmail: checkoutDetails.customerEmail || selectedAddress?.gmail || profile?.email || "",
    deliveryAddress: checkoutDetails.deliveryAddress || selectedAddress?.fullAddress || "",
    district: checkoutDetails.district || selectedAddress?.district || "",
    thana: checkoutDetails.thana || selectedAddress?.thana || "",
  };
  const selectedDistrict = activeCheckoutDetails.district.trim();

  const addressLabel = (address: typeof savedAddresses[number]) =>
    [address.fullName, address.district, address.thana].filter(Boolean).join(" - ");

  const deliveryCharge = deliveryChargeForWeight(selectedDistrict, totalItems);
  const vatCharge = VAT_CHARGE;
  const grandTotal = total + deliveryCharge + vatCharge;
  const deliveryWeightText = `${Math.max(1, Math.ceil(totalItems / 3))}KG`;
  const canSubmitOrder =
    cartProducts.length > 0 &&
    activeCheckoutDetails.customerName.trim() &&
    activeCheckoutDetails.customerPhone.trim() &&
    activeCheckoutDetails.customerEmail.trim() &&
    activeCheckoutDetails.deliveryAddress.trim() &&
    activeCheckoutDetails.district.trim() &&
    activeCheckoutDetails.thana.trim();

  const updateCheckoutField = (field: keyof typeof checkoutDetails, value: string) => {
    setCheckoutDetails((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderStatus("submitting");
    setOrderMessage("");

    const order: CheckoutOrder = {
      orderId: "pending",
      customerName: activeCheckoutDetails.customerName.trim(),
      customerPhone: activeCheckoutDetails.customerPhone.trim(),
      customerEmail: activeCheckoutDetails.customerEmail.trim(),
      deliveryAddress: activeCheckoutDetails.deliveryAddress.trim(),
      district: activeCheckoutDetails.district.trim(),
      thana: activeCheckoutDetails.thana.trim(),
      items: cartProducts.map(({ item, product }) => ({
        productSlug: product.slug,
        productName: product.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
      })),
      subtotal: total,
      deliveryCharge,
      vat: vatCharge,
      grandTotal,
      paymentMethod: COD_PAYMENT_METHOD,
      createdAt: "pending",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      const result = (await response.json()) as { error?: string; orderId?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not place order.");
      }

      clearCart();
      setOrderStatus("success");
      setOrderMessage(`Order ${result.orderId ?? order.orderId} placed. We sent it to the admin for confirmation.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage(error instanceof Error ? error.message : "Could not place order.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Cart</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Your selected pieces</h1>
      </div>
      {orderStatus === "success" && orderMessage && (
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-emerald-800">
          {orderMessage}
        </div>
      )}
      {cartProducts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cartProducts.map(({ item, product }) => (
              <article key={item.id} className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-white p-4 sm:grid-cols-[160px_1fr]">
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.4rem] bg-zinc-50">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="160px" />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-950">{product.name}</h2>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-zinc-950">{formatPrice(product.price * item.quantity)}</p>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-zinc-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1, product.stock)}
                          disabled={item.quantity <= 1}
                          className="flex h-full w-10 items-center justify-center text-lg text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
                          aria-label={`Decrease ${product.name} quantity`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, product.stock)}
                          value={item.quantity}
                          onChange={(event) => updateCartQuantity(item.id, Number(event.target.value), product.stock)}
                          className="h-full w-14 border-x border-zinc-200 text-center text-sm font-semibold text-zinc-950 outline-none"
                          aria-label={`${product.name} quantity`}
                        />
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1, product.stock)}
                          disabled={item.quantity >= product.stock}
                          className="flex h-full w-10 items-center justify-center text-lg text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
                          aria-label={`Increase ${product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] border border-zinc-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">Order Summary</p>
            <div className="mt-5 flex items-center justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <label className="mt-4 block text-sm text-zinc-700">
              Delivery address
              <select
                value={selectedAddress?.id ?? ""}
                onChange={(event) => {
                  const nextAddress = savedAddresses.find((address) => address.id === event.target.value);
                  setSelectedAddressId(event.target.value);
                  setCheckoutDetails({
                    customerName: nextAddress?.fullName ?? "",
                    customerPhone: nextAddress?.phoneNumber ?? "",
                    customerEmail: nextAddress?.gmail ?? "",
                    deliveryAddress: nextAddress?.fullAddress ?? "",
                    district: nextAddress?.district ?? "",
                    thana: nextAddress?.thana ?? "",
                  });
                }}
                disabled={savedAddresses.length === 0}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950"
              >
                <option value="">{savedAddresses.length > 0 ? "Select saved address" : "No saved address found"}</option>
                {savedAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {addressLabel(address)}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs text-zinc-500">
              Choose a saved address or enter the delivery details below.
            </p>
            <form className="mt-5 space-y-3" onSubmit={submitOrder}>
              {[
                ["customerName", "Customer name"],
                ["customerPhone", "Phone number"],
                ["customerEmail", "Email"],
                ["deliveryAddress", "Delivery address"],
                ["district", "District"],
                ["thana", "Thana"],
              ].map(([field, label]) => (
                <label key={field} className="block text-sm text-zinc-700">
                  {label}
                  <input
                    type={field === "customerEmail" ? "email" : "text"}
                    value={activeCheckoutDetails[field as keyof typeof activeCheckoutDetails]}
                    onChange={(event) =>
                      updateCheckoutField(field as keyof typeof checkoutDetails, event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950"
                  />
                </label>
              ))}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Payment method
                </span>
                <span className="mt-1 block font-semibold text-zinc-950">{COD_PAYMENT_METHOD}</span>
              </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery district</span>
              <span>{selectedDistrict || "Choose address"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery charge</span>
              <span>{selectedDistrict ? formatPrice(deliveryCharge) : "Choose address"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery weight</span>
              <span>{selectedDistrict ? deliveryWeightText : "Choose address"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>VAT</span>
              <span>{formatPrice(vatCharge)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
            <p className="mt-4 text-xs italic text-zinc-500">
              Same address delivery: up to 3 pcs counts as 1KG. More items increase the shipment weight and delivery cost.
            </p>
            <div className="mt-6 border-t border-zinc-200 pt-6">
              <p className="text-xl font-semibold text-zinc-950">{formatPrice(grandTotal)}</p>
              <button
                type="submit"
                disabled={!canSubmitOrder || orderStatus === "submitting"}
                className="mt-4 inline-flex w-full justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {orderStatus === "submitting" ? "Placing order..." : "Place Cash on Delivery Order"}
              </button>
              {orderMessage && (
                <p
                  className={`mt-3 text-sm ${
                    orderStatus === "error" ? "text-rose-700" : "text-emerald-700"
                  }`}
                >
                  {orderMessage}
                </p>
              )}
            </div>
            </form>
          </aside>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm leading-7 text-zinc-600">
          Your cart is empty. <Link href="/catalog" className="font-medium text-zinc-950">Browse the catalog</Link> to add products.
        </div>
      )}
    </div>
  );
}
