"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, LogOut, MapPin, Plus, Save, ShieldCheck, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/shared/logo";
import type { Address } from "@/types/catalog";

const blankAddress = (): Address => ({
  id: crypto.randomUUID(),
  fullName: "",
  fullAddress: "",
  district: "",
  thana: "",
  phoneNumber: "",
  gmail: "",
  isDefault: false,
});

export function DashboardShell() {
  const { user, profile, loading, logout, saveAddresses, saveProfilePhoto } = useAuth();
  const [draftAddresses, setDraftAddresses] = useState<Address[] | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-cyan-400/20 bg-[#08112d] p-8 text-sm text-cyan-100/70">
        Preparing your account dashboard...
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="rounded-[2rem] border border-cyan-400/20 bg-[#08112d] p-8 text-sm text-cyan-100/70">
        Please sign in to manage your LUMES BD profile and delivery addresses.
      </div>
    );
  }

  const addresses = draftAddresses ?? profile.addresses;

  const setDefault = (id: string) => {
    setDraftAddresses((current) =>
      (current ?? profile.addresses).map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  };

  const updateAddresses = (updater: (current: Address[]) => Address[]) => {
    setDraftAddresses((current) => updater(current ?? profile.addresses));
  };

  const save = async () => {
    try {
      const normalized = addresses.map((address, index) => ({
        ...address,
        isDefault: address.isDefault || (!addresses.some((item) => item.isDefault) && index === 0),
      }));
      await saveAddresses(normalized);
      setDraftAddresses(normalized);
      setMessage("Delivery details saved.");
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not save addresses.");
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#08112d] shadow-[0_30px_90px_-58px_rgba(1,197,250,0.5)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <Logo />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/78">Account Dashboard</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Manage the details that keep every order moving.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-cyan-50/72 sm:text-base sm:leading-8">
              Keep your profile, delivery contacts, and saved addresses polished so checkout stays quick and accurate.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-cyan-50/78 sm:grid-cols-3 lg:w-[420px]">
            {[
              ["Payment", "COD only"],
              ["Addresses", `${addresses.length}/3 saved`],
              ["Status", "Secure profile"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-cyan-300/15 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/60">{label}</p>
                <p className="mt-2 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-cyan-400/15 bg-white p-6 text-zinc-950 shadow-[0_24px_70px_-48px_rgba(1,197,250,0.28)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cyan-50 p-2 text-cyan-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Profile</p>
              <h2 className="text-2xl font-semibold text-zinc-950">Customer identity</h2>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-4">
            {profile.photoDataUrl ? (
              <Image
                src={profile.photoDataUrl}
                alt={profile.displayName}
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 rounded-[1.7rem] object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.7rem] border border-cyan-100 bg-[#08112d] p-4">
                <Image src="/lumes-logo.png" alt="LUMES BD" width={120} height={40} className="h-auto w-full" />
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-zinc-950">{profile.displayName}</p>
              <p className="mt-1 text-sm text-zinc-600">{profile.email || profile.phoneNumber || "No contact added"}</p>
              <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active customer profile
              </p>
            </div>
          </div>

          <label className="mt-7 block rounded-[1.4rem] border border-dashed border-cyan-200 bg-cyan-50/50 p-5 text-sm text-zinc-700">
            <span className="flex items-center gap-2 font-semibold text-zinc-950">
              <Upload className="h-4 w-4 text-cyan-700" />
              Update profile photo
            </span>
            <span className="mt-2 block leading-6 text-zinc-600">
              Upload a JPG image under 200 KB for a cleaner account profile.
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,image/jpeg"
              className="mt-4 block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  await saveProfilePhoto(file);
                  setMessage("Profile photo updated.");
                  setError("");
                } catch (nextError) {
                  setError(nextError instanceof Error ? nextError.message : "Could not save photo.");
                  setMessage("");
                }
              }}
            />
          </label>
          <button type="button" onClick={() => logout()} className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </section>

        <section className="rounded-[2rem] border border-cyan-400/15 bg-white p-6 text-zinc-950 shadow-[0_24px_70px_-48px_rgba(1,197,250,0.28)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-cyan-50 p-2 text-cyan-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Delivery</p>
                  <h2 className="text-2xl font-semibold text-zinc-950">Saved addresses</h2>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600">
                Save up to three delivery addresses and mark the one you use most often as default for Cash on Delivery checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => addresses.length < 3 && updateAddresses((current) => [...current, blankAddress()])}
              disabled={addresses.length >= 3}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
            >
              <Plus className="h-4 w-4" />
              Add address
            </button>
          </div>

          <div className="mt-7 space-y-4">
            {addresses.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm leading-7 text-zinc-600">
                <Home className="mb-3 h-5 w-5 text-cyan-700" />
                No delivery address saved yet. Add one now to make checkout faster and keep delivery charges accurate.
              </div>
            ) : (
              addresses.map((address, index) => (
                <div key={address.id} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-800">
                      <input type="radio" name="default-address" checked={address.isDefault} onChange={() => setDefault(address.id)} />
                      {address.isDefault ? "Default delivery address" : `Delivery address ${index + 1}`}
                    </label>
                    <button
                      type="button"
                      onClick={() => updateAddresses((current) => current.filter((item) => item.id !== address.id))}
                      className="rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:border-rose-200 hover:text-rose-600"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["fullName", "Recipient name"],
                      ["fullAddress", "Full delivery address"],
                      ["district", "District"],
                      ["thana", "Thana"],
                      ["phoneNumber", "Phone number"],
                      ["gmail", "Email address"],
                    ].map(([field, label]) => (
                      <label key={field} className={`text-sm font-medium text-zinc-700 ${field === "fullAddress" ? "sm:col-span-2" : ""}`}>
                        {label}
                        <input
                          value={address[field as keyof Address] as string}
                          onChange={(event) =>
                            updateAddresses((current) =>
                              current.map((item) =>
                                item.id === address.id ? { ...item, [field]: event.target.value } : item,
                              ),
                            )
                          }
                          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition focus:border-cyan-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={save} className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
              <Save className="h-4 w-4" />
              Save delivery details
            </button>
            {message && <p className="text-sm font-medium text-emerald-700">{message}</p>}
            {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
