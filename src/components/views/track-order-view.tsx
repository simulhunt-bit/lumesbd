"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Clock, PackageCheck, Truck } from "lucide-react";
import { useAuth } from "@/context/auth-context";

type TrackingStatus = "confirmed" | "picked_up" | "completed";

type OrderTrackingRecord = {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  productNames: string[];
  trackingId?: string;
  status: TrackingStatus;
  confirmedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  updatedAt: string;
};

const steps = [
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "picked_up", label: "Picked up", icon: Truck },
  { id: "completed", label: "Completed", icon: PackageCheck },
] as const;

const statusRank: Record<TrackingStatus, number> = {
  confirmed: 0,
  picked_up: 1,
  completed: 2,
};

export function TrackOrderView() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") ?? "");
  const [trackingId, setTrackingId] = useState(searchParams.get("trackingId") ?? "");
  const [orders, setOrders] = useState<OrderTrackingRecord[]>([]);
  const [message, setMessage] = useState("Enter your order or tracking details to load status.");
  const [loading, setLoading] = useState(false);
  const profileEmail = profile?.email ?? "";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (orderId.trim()) params.set("orderId", orderId.trim());
    if (trackingId.trim()) params.set("trackingId", trackingId.trim());
    if (!orderId.trim() && profileEmail) params.set("email", profileEmail);
    return params.toString();
  }, [orderId, profileEmail, trackingId]);

  const loadOrders = async () => {
    if (!queryString) return;

    setLoading(true);
    setMessage("Loading tracking details...");

    try {
      const response = await fetch(`/api/order-tracking?${queryString}`);
      const result = (await response.json()) as { orders?: OrderTrackingRecord[]; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load tracking details.");
      }

      setOrders(result.orders ?? []);
      setMessage(result.orders?.length ? "" : "No tracking details found yet.");
    } catch (error) {
      setOrders([]);
      setMessage(error instanceof Error ? error.message : "Could not load tracking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!queryString) return;

    let cancelled = false;

    const loadInitialOrders = async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setMessage("Loading tracking details...");

      try {
        const response = await fetch(`/api/order-tracking?${queryString}`);
        const result = (await response.json()) as { orders?: OrderTrackingRecord[]; error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Could not load tracking details.");
        }

        if (cancelled) return;
        setOrders(result.orders ?? []);
        setMessage(result.orders?.length ? "" : "No tracking details found yet.");
      } catch (error) {
        if (cancelled) return;
        setOrders([]);
        setMessage(error instanceof Error ? error.message : "Could not load tracking details.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialOrders();

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadOrders();
  };

  return (
    <div className="mt-10 space-y-5">
      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto]" onSubmit={submit}>
        <input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="Order ID"
          className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
        />
        <input
          value={trackingId}
          onChange={(event) => setTrackingId(event.target.value)}
          placeholder="Tracking ID"
          className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {loading ? "Loading..." : "Track"}
        </button>
      </form>

      {message && (
        <p className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.orderId} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">{order.orderId}</p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-950">{order.productNames.join(", ")}</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Tracking ID: <span className="font-semibold text-zinc-950">{order.trackingId ?? "Pending"}</span>
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                <Clock className="h-3.5 w-3.5" />
                {order.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;
                const active = statusRank[order.status] >= statusRank[step.id];

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-4 ${
                      active ? "border-cyan-200 bg-cyan-50 text-cyan-950" : "border-zinc-200 bg-zinc-50 text-zinc-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <p className="mt-3 text-sm font-semibold">{step.label}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
