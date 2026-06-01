"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Clock, Loader, MapPin, PackageCheck, Search, Truck } from "lucide-react";
import { useAuth } from "@/context/auth-context";

type TrackingStatus = "confirmed" | "soon_picked_up" | "picked_up" | "picked_up_from_us" | "completed";

type OrderTrackingRecord = {
  orderId: string;
  productNames: string[];
  trackingId?: string;
  status: TrackingStatus;
  confirmedAt?: string;
  soonPickedUpAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  updatedAt: string;
};

const steps = [
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "soon_picked_up", label: "Soon picked up", icon: Loader },
  { id: "picked_up_from_us", label: "Picked up from us", icon: Truck },
  { id: "completed", label: "Completed", icon: PackageCheck },
] as const;

const statusRank: Record<TrackingStatus, number> = {
  confirmed: 0,
  soon_picked_up: 1,
  picked_up: 2,
  picked_up_from_us: 2,
  completed: 3,
};

const statusDetails: Record<TrackingStatus, { label: string; description: string }> = {
  confirmed: {
    label: "Confirmed",
    description: "Your order has been confirmed by LUMES BD.",
  },
  soon_picked_up: {
    label: "Soon picked up",
    description: "Your parcel is being prepared and will be picked up soon.",
  },
  picked_up: {
    label: "Picked up from us",
    description: "Your order has left LUMES BD and will be delivered soon.",
  },
  picked_up_from_us: {
    label: "Picked up from us",
    description: "Your order has left LUMES BD and will be delivered soon.",
  },
  completed: {
    label: "Completed",
    description: "Your order has been completed. Thank you for shopping with us.",
  },
};

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Pending";

export function TrackOrderView() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") ?? "");
  const [trackingId, setTrackingId] = useState(searchParams.get("trackingId") ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [orders, setOrders] = useState<OrderTrackingRecord[]>([]);
  const [message, setMessage] = useState("Enter your order ID with the matching email or tracking ID to load status.");
  const [loading, setLoading] = useState(false);
  const profileEmail = profile?.email ?? "";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (orderId.trim()) params.set("orderId", orderId.trim());
    if (trackingId.trim()) params.set("trackingId", trackingId.trim());
    if (!trackingId.trim() && (email.trim() || profileEmail)) params.set("email", (email.trim() || profileEmail).trim());
    return params.toString();
  }, [email, orderId, profileEmail, trackingId]);

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
    <div className="mt-10 space-y-6">
      <form
        className="overflow-hidden rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] p-4 shadow-[0_30px_90px_-58px_rgba(1,197,250,0.5)] sm:rounded-[2rem] sm:p-5"
        onSubmit={submit}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Order lookup</p>
            <p className="mt-2 text-sm leading-6 text-cyan-50/68">
              Enter your order ID, tracking ID, or both to check the latest movement.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Bangladesh delivery
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Order ID"
            aria-label="Order ID"
            className="min-h-12 rounded-2xl border border-cyan-300/15 bg-white/95 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white"
          />
          <input
            value={trackingId}
            onChange={(event) => setTrackingId(event.target.value)}
            placeholder="Tracking ID"
            aria-label="Tracking ID"
            className="min-h-12 rounded-2xl border border-cyan-300/15 bg-white/95 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Order email"
            aria-label="Order email"
            type="email"
            className="min-h-12 rounded-2xl border border-cyan-300/15 bg-white/95 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-cyan-50/40"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {loading ? "Loading..." : "Track"}
          </button>
        </div>
      </form>

      {message && (
        <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm leading-6 text-cyan-50">{message}</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const currentStatus = statusDetails[order.status];

          return (
            <article
              key={order.orderId}
              className="overflow-hidden rounded-[1.75rem] border border-cyan-400/15 bg-[#08112d] text-white shadow-[0_30px_90px_-58px_rgba(1,197,250,0.5)] sm:rounded-[2rem]"
            >
              <div className="border-b border-cyan-300/15 bg-[radial-gradient(circle_at_12%_0%,_rgba(1,197,250,0.18),_transparent_34%),linear-gradient(135deg,_#08112d,_#060c24)] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{order.orderId}</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{currentStatus.label}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50/72">{currentStatus.description}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_-22px_rgba(1,197,250,0.8)]">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {currentStatus.label}
                  </span>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-cyan-300/15 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">Products</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white">{order.productNames.join(", ")}</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/15 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">Tracking ID</p>
                    <p className="mt-2 text-sm font-semibold text-white">{order.trackingId ?? "Pending"}</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/15 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">Last update</p>
                    <p className="mt-2 text-sm font-medium text-white">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const active = statusRank[order.status] >= statusRank[step.id];

                    return (
                      <div
                        key={step.id}
                        className={`rounded-2xl border p-4 transition ${
                          active
                            ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-50"
                            : "border-cyan-300/10 bg-white/5 text-cyan-50/45"
                        }`}
                      >
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                            active ? "bg-cyan-300 text-slate-950" : "bg-white/5 text-cyan-50/45"
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <p className="mt-3 text-sm font-semibold">{step.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-3 border-t border-cyan-300/15 pt-5 text-sm sm:grid-cols-3">
                  <p className="text-cyan-50/55">
                    Confirmed
                    <span className="mt-1 block font-medium text-white">{formatDate(order.confirmedAt)}</span>
                  </p>
                  <p className="text-cyan-50/55">
                    Picked up
                    <span className="mt-1 block font-medium text-white">{formatDate(order.pickedUpAt)}</span>
                  </p>
                  <p className="text-cyan-50/55">
                    Completed
                    <span className="mt-1 block font-medium text-white">{formatDate(order.completedAt)}</span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
