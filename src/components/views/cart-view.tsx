"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";
import { getProducts } from "@/lib/catalog";
import { formatPrice, deliveryChargeForWeight, VAT_CHARGE } from "@/lib/utils";

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
  const { cart, removeFromCart } = useShop();
  const { profile } = useAuth();
  const cartProducts = cart
    .map((item) => {
      const product = getProducts().find((entry) => entry.slug === item.slug);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as CartProduct[];

  const total = cartProducts.reduce((sum, entry) => sum + entry.product.price * entry.item.quantity, 0);
  const totalItems = cartProducts.reduce((sum, entry) => sum + entry.item.quantity, 0);

  const savedDistricts = profile?.addresses
    .map((address) => address.district.trim())
    .filter(Boolean) ?? [];

  const uniqueDistricts = Array.from(new Set(savedDistricts));
  const defaultDistrict =
    profile?.addresses.find((address) => address.isDefault)?.district.trim() ||
    uniqueDistricts[0] ||
    "";

  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);

  useEffect(() => {
    if (!selectedDistrict && defaultDistrict) {
      setSelectedDistrict(defaultDistrict);
    }
  }, [defaultDistrict, selectedDistrict]);

  const districtOptions =
    uniqueDistricts.length > 0
      ? uniqueDistricts
      : ["Dhaka", "Chattogram", "Rajshahi", "Sylhet", "Khulna", "Barishal", "Mymensingh", "Rangpur"];

  const deliveryCharge = deliveryChargeForWeight(selectedDistrict, totalItems);
  const vatCharge = VAT_CHARGE;
  const grandTotal = total + deliveryCharge + vatCharge;
  const deliveryWeightText = `${Math.max(1, Math.ceil(totalItems / 3))}KG`; 

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Cart</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Your selected pieces</h1>
      </div>
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
                    <p className="mt-2 text-sm text-zinc-600">Quantity: {item.quantity}</p>
                    <p className="mt-2 text-sm text-zinc-600">Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-zinc-950">{formatPrice(product.price * item.quantity)}</p>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900">
                      Remove
                    </button>
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
              Delivery district
              <select
                value={selectedDistrict}
                onChange={(event) => setSelectedDistrict(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950"
              >
                <option value="">Select district</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery charge</span>
              <span>{selectedDistrict ? formatPrice(deliveryCharge) : "Choose district"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Delivery weight</span>
              <span>{selectedDistrict ? deliveryWeightText : "Choose district"}</span>
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
              <Link href="/dashboard" className="mt-4 inline-flex w-full justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white">
                Continue to Checkout Setup
              </Link>
            </div>
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
