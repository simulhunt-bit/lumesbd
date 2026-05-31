"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CreditCard, Package, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { LocationSelects } from "@/components/shared/location-selects";
import { SmartImage } from "@/components/shared/smart-image";
import { getProducts } from "@/lib/catalog";
import { formatPrice, deliveryChargeForWeight } from "@/lib/utils";
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
  const grandTotal = total + deliveryCharge;
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
      vat: 0,
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
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-5 text-white shadow-2xl shadow-slate-950/10 sm:rounded-[2rem] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Cart</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Your selected pieces
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Review your LUMES picks, confirm delivery details, and place a Cash on Delivery order.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-56">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="block text-xs text-slate-400">Items</span>
              <strong className="mt-1 block text-xl text-white">{totalItems}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="block text-xs text-slate-400">Subtotal</span>
              <strong className="mt-1 block text-lg text-cyan-100">{formatPrice(total)}</strong>
            </div>
          </div>
        </div>
      </section>
      {orderStatus === "success" && orderMessage && (
        <div className="rounded-[1.5rem] border border-emerald-300/50 bg-emerald-50 p-5 text-sm leading-7 text-emerald-800 sm:rounded-[2rem] sm:p-6">
          {orderMessage}
        </div>
      )}
      {cartProducts.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(290px,360px)] lg:gap-6">
          <div className="space-y-4">
            {cartProducts.map(({ item, product }) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[1.5rem] border border-cyan-400/15 bg-[#08112d] p-3 text-white shadow-xl shadow-slate-950/5 sm:grid-cols-[140px_1fr] sm:rounded-[2rem] sm:p-4"
              >
                <div className="relative aspect-[4/4.35] overflow-hidden rounded-[1.1rem] border border-white/10 bg-slate-950 sm:rounded-[1.4rem]">
                  <SmartImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    imageClassName="object-cover"
                    sizes="(max-width: 640px) 100vw, 140px"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white sm:text-xl">{product.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-cyan-100 sm:text-sm">
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
                        Size {item.size}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400 sm:text-sm">
                      {product.stock > 0 ? `${product.stock} pieces available` : "Currently out of stock"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-semibold text-cyan-100">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                    <div className="flex w-full flex-col gap-3 min-[420px]:flex-row sm:w-auto sm:items-center">
                      <div className="inline-flex h-11 w-full items-center overflow-hidden rounded-full border border-white/10 bg-white/5 min-[420px]:w-auto">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1, product.stock)}
                          disabled={item.quantity <= 1}
                          className="flex h-full flex-1 items-center justify-center text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600 min-[420px]:w-10 min-[420px]:flex-none"
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
                          className="h-full w-14 border-x border-white/10 bg-transparent text-center text-sm font-semibold text-white outline-none"
                          aria-label={`${product.name} quantity`}
                        />
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1, product.stock)}
                          disabled={item.quantity >= product.stock}
                          className="flex h-full flex-1 items-center justify-center text-lg text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-slate-600 min-[420px]:w-10 min-[420px]:flex-none"
                          aria-label={`Increase ${product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-rose-300/30 px-4 text-sm font-medium text-rose-100 transition hover:bg-rose-400/10"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-5 text-white shadow-2xl shadow-slate-950/10 sm:rounded-[2rem] sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Order Summary</p>
                <h2 className="text-lg font-semibold text-white">Cash on Delivery</h2>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">{formatPrice(total)}</span>
            </div>
            <label className="mt-4 block text-sm text-slate-200">
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
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400"
              >
                <option value="">{savedAddresses.length > 0 ? "Select saved address" : "No saved address found"}</option>
                {savedAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {addressLabel(address)}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Choose a saved address or enter the delivery details below.
            </p>
            <form className="mt-5 space-y-3" onSubmit={submitOrder}>
              {[
                ["customerName", "Customer name"],
                ["customerPhone", "Phone number"],
                ["customerEmail", "Email"],
                ["deliveryAddress", "Delivery address"],
              ].map(([field, label]) => (
                <label key={field} className="block text-sm text-slate-200">
                  {label}
                  <input
                    type={field === "customerEmail" ? "email" : "text"}
                    value={activeCheckoutDetails[field as keyof typeof activeCheckoutDetails]}
                    onChange={(event) =>
                      updateCheckoutField(field as keyof typeof checkoutDetails, event.target.value)
                    }
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400"
                  />
                </label>
              ))}
              <LocationSelects
                district={activeCheckoutDetails.district}
                thana={activeCheckoutDetails.thana}
                onDistrictChange={(value) => updateCheckoutField("district", value)}
                onThanaChange={(value) => updateCheckoutField("thana", value)}
                labelClassName="block text-sm text-slate-200"
                selectClassName="mt-2 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              />
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  Payment method
                </span>
                <span className="mt-2 block font-semibold text-white">{COD_PAYMENT_METHOD}</span>
              </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>Delivery district</span>
              <span className="text-right font-medium text-white">{selectedDistrict || "Choose address"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>Delivery charge</span>
              <span className="text-right font-medium text-white">
                {selectedDistrict ? formatPrice(deliveryCharge) : "Choose address"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>Delivery weight</span>
              <span className="text-right font-medium text-white">{selectedDistrict ? deliveryWeightText : "Choose address"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>Total</span>
              <span className="text-right font-medium text-white">{formatPrice(grandTotal)}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              Same address delivery: up to 3 pcs counts as 1KG. More items increase the shipment weight and delivery cost.
            </p>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="flex items-center justify-between gap-4 text-sm text-slate-300">
                <span>Grand total</span>
                <strong className="text-2xl text-cyan-100">{formatPrice(grandTotal)}</strong>
              </p>
              <button
                type="submit"
                disabled={!canSubmitOrder || orderStatus === "submitting"}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition enabled:hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {orderStatus === "submitting" ? "Placing order..." : "Place Cash on Delivery Order"}
                {orderStatus !== "submitting" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
              {orderMessage && (
                <p
                  className={`mt-3 text-sm ${
                    orderStatus === "error" ? "text-rose-200" : "text-emerald-200"
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
        <div className="rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-6 text-center text-sm leading-7 text-slate-300 sm:rounded-[2rem] sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100">
            <Package className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-semibold text-white">Your cart is ready when you are</h2>
          <p className="mx-auto mt-2 max-w-md">
            Add your favorite pieces and come back here to confirm delivery with Cash on Delivery.
          </p>
          <Link
            href="/catalog"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Browse the catalog
          </Link>
        </div>
      )}
    </div>
  );
}
