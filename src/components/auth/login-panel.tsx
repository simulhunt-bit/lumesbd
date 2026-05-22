"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export function LoginPanel() {
  const { authEnabled, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not log in with Google.");
    }
  };

  return (
    <div className="grid gap-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(24,24,27,0.35)] lg:grid-cols-2 lg:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600">Access</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">Login to your LUMES account</h1>
        <p className="mt-4 text-base leading-8 text-zinc-600">
          Google login is wired for Firebase Authentication and is the only enabled account access method for this storefront.
        </p>
        {!authEnabled && (
          <div className="mt-5 rounded-[1.4rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
            Firebase environment variables are not configured yet. The UI is ready, but authentication will stay disabled until you add your keys.
          </div>
        )}
      </div>
      <div className="space-y-4 rounded-[1.5rem] border border-zinc-200 p-4 sm:p-5">
        <p className="text-sm leading-7 text-zinc-600">
          Continue with your Google account to access your saved profile, delivery addresses, wishlist, and order-ready checkout details.
        </p>
        <button
          type="button"
          disabled={!authEnabled}
          onClick={handleGoogle}
          className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Continue with Google
        </button>
        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>
    </div>
  );
}
