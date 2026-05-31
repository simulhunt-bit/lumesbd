"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/shared/logo";

export function LoginPanel({
  redirectPath = "/dashboard",
  sessionExpired = false,
}: {
  redirectPath?: string;
  sessionExpired?: boolean;
}) {
  const router = useRouter();
  const { authEnabled, loginWithGoogle, user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router, user]);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await loginWithGoogle();
      router.push(redirectPath);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not log in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[#08112d] shadow-[0_30px_90px_-55px_rgba(1,197,250,0.45)]">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative min-h-[440px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,_rgba(1,197,250,0.22),_transparent_34%),linear-gradient(135deg,_#060c24,_#0d1535_52%,_#08112d)] p-6 sm:p-8 lg:p-10">
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <Logo />
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Member Access</p>
              <h1 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Your LUMES account, ready for faster checkout.
              </h1>
              <p className="mt-5 text-sm leading-7 text-cyan-50/72 sm:text-base sm:leading-8">
                Sign in once to keep delivery details, wishlist picks, and order-ready checkout information close at hand.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-cyan-50/78 sm:grid-cols-3">
              {["Saved addresses", "Wishlist sync", "Secure access"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-white/5 px-3 py-3 backdrop-blur">
                  <CheckCircle2 className="h-4 w-4 text-[#01c5fa]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white p-6 text-zinc-950 sm:p-8 lg:p-10">
          <div className="flex h-full flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              <ShieldCheck className="h-4 w-4" />
              Private account
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">Continue securely</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Use Google sign-in to access your LUMES BD profile. We use it only for account access and saved shopping details.
            </p>
            {sessionExpired && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                Your session expired. Please log in again.
              </div>
            )}

            <button
              type="button"
              disabled={!authEnabled || loading}
              onClick={handleGoogle}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Signing in..." : "Continue with Google"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-xs leading-6 text-zinc-500">
              Cash on Delivery remains the only payment method at checkout.
            </p>

            {!authEnabled && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-800">
                Account access is temporarily unavailable. Please try again later or contact LUMES BD support for help with your profile.
              </div>
            )}
            {error && <p className="mt-4 text-sm leading-6 text-rose-600">{error}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
