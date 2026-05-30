"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function LoginPanel() {
  const router = useRouter();
  const { authEnabled, loginWithGoogle, user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not log in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 rounded-2xl border border-cyan-500/20 bg-[#0a1428] p-6 shadow-[0_24px_70px_-48px_rgba(1,197,250,0.2)] lg:grid-cols-2 lg:p-10">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/80">Access</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Login to your<br />LUMES account</h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-cyan-100/70">
          Google login is wired for Firebase Authentication and is the only enabled account access method for this storefront.
        </p>
        {!authEnabled && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-7 text-amber-200">
            Firebase environment variables are not configured yet. The UI is ready, but authentication will stay disabled until you add your keys.
          </div>
        )}
      </div>
      <div className="space-y-5 rounded-xl border border-cyan-500/20 bg-[#060c24] p-6 sm:p-8">
        <p className="text-sm leading-7 text-cyan-100/70">
          Continue with your Google account to access your saved profile, delivery addresses, wishlist, and order-ready checkout details.
        </p>
        <button
          type="button"
          disabled={!authEnabled || loading}
          onClick={handleGoogle}
          className="w-full rounded-full border border-cyan-400/20 bg-transparent px-5 py-3 text-sm font-medium text-cyan-100/78 transition enabled:hover:border-cyan-400/50 enabled:hover:text-[#01c5fa] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
        {error && <p className="text-sm leading-6 text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
