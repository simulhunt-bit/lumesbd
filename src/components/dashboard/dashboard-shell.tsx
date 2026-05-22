"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
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
    return <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Loading dashboard...</div>;
  }

  if (!user || !profile) {
    return <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm text-zinc-600">Please log in to manage your account.</div>;
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
      setMessage("Addresses saved to Firebase.");
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not save addresses.");
      setMessage("");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(24,24,27,0.4)]">
        <h1 className="text-3xl font-semibold text-zinc-950">Profile</h1>
        <div className="mt-6 flex items-center gap-4">
          {profile.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoDataUrl} alt={profile.displayName} className="h-20 w-20 rounded-3xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-xl font-semibold text-zinc-500">
              {profile.displayName.slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-zinc-950">{profile.displayName}</p>
            <p className="text-sm text-zinc-600">{profile.email || profile.phoneNumber}</p>
          </div>
        </div>
        <label className="mt-6 block rounded-[1.4rem] border border-dashed border-zinc-300 p-4 text-sm text-zinc-600">
          Upload JPG profile photo, max 200 KB
          <input
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            className="mt-3 block w-full text-sm"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                await saveProfilePhoto(file);
                setMessage("Profile photo saved.");
                setError("");
              } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : "Could not save photo.");
                setMessage("");
              }
            }}
          />
        </label>
        <button type="button" onClick={() => logout()} className="mt-6 rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-300">
          Log out
        </button>
      </section>

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(24,24,27,0.4)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-zinc-950">Addresses</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">Add up to 3 delivery addresses, edit them anytime, and mark one as default.</p>
          </div>
          <button
            type="button"
            onClick={() => addresses.length < 3 && updateAddresses((current) => [...current, blankAddress()])}
            className="rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white"
          >
            Add Address
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-[1.5rem] border border-zinc-200 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <input type="radio" name="default-address" checked={address.isDefault} onChange={() => setDefault(address.id)} />
                  Default address
                </label>
                <button
                  type="button"
                  onClick={() => updateAddresses((current) => current.filter((item) => item.id !== address.id))}
                  className="rounded-full border border-zinc-200 p-2 text-zinc-600"
                  aria-label="Delete address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["fullName", "Full Name"],
                  ["fullAddress", "Full Address"],
                  ["district", "District"],
                  ["thana", "Thana"],
                  ["phoneNumber", "Phone Number"],
                  ["gmail", "Gmail"],
                ].map(([field, label]) => (
                  <label key={field} className={`text-sm text-zinc-700 ${field === "fullAddress" ? "sm:col-span-2" : ""}`}>
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
                      className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 outline-none ring-0 transition focus:border-zinc-950"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={save} className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white">
            Save Addresses
          </button>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>
      </section>
    </div>
  );
}
