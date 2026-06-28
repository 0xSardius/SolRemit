"use client";

import { useState } from "react";
import {
  useCreateSolanaAccount,
  useIsSignedIn,
  useSignInWithEmail,
  useSignOut,
  useSolanaAddress,
  useVerifyEmailOTP,
} from "@coinbase/cdp-hooks";
import { isCdpConfigured } from "@/lib/cdp/config";
import { useLang } from "./lang-provider";

/** Gate: only mount the hook-using inner bar when CDP is actually configured. */
export function WalletBar() {
  const { t } = useLang();
  if (!isCdpConfigured) {
    return (
      <p className="rounded-lg border border-border-low bg-bg1 px-4 py-2.5 text-xs text-muted">
        {t("wallet.off")}
      </p>
    );
  }
  return <WalletBarInner />;
}

function truncate(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function WalletBarInner() {
  const { isSignedIn } = useIsSignedIn();
  const { solanaAddress } = useSolanaAddress();
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { createSolanaAccount } = useCreateSolanaAccount();
  const { signOut } = useSignOut();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [flowId, setFlowId] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { flowId } = await signInWithEmail({ email });
      setFlowId(flowId);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setBusy(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyEmailOTP({ flowId, otp });
      // Ensure the user has a Solana account (throws if one already exists).
      try {
        await createSolanaAccount();
      } catch {
        /* already has one — fine */
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function handleFund() {
    if (!solanaAddress) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/onramp/buy-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: "US",
          subdivision: "CA",
          paymentAmount: "50.00",
          paymentCurrency: "USD",
          paymentMethod: "CARD",
          purchaseCurrency: "USDC",
          purchaseNetwork: "solana",
          destinationAddress: solanaAddress,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Quote failed");
      if (json.onrampUrl) window.open(json.onrampUrl, "_blank", "noopener");
      else throw new Error("No onramp URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Funding failed");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "rounded-lg border border-border-low bg-bg1 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
  const btnCls =
    "rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";

  if (isSignedIn) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-low bg-bg1 px-4 py-2.5 text-sm">
        <span className="text-muted">Wallet</span>
        <span className="font-mono">{solanaAddress ? truncate(solanaAddress) : "creating…"}</span>
        <button onClick={handleFund} disabled={busy || !solanaAddress} className={btnCls}>
          Add funds (USD→USDC)
        </button>
        <button onClick={() => signOut()} className={`${btnCls} ml-auto`}>
          Sign out
        </button>
        {error && <p className="w-full font-mono text-xs text-amber-600 dark:text-amber-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-low bg-bg1 px-4 py-3">
      {step === "email" ? (
        <form onSubmit={handleEmail} className="flex flex-wrap items-center gap-2">
          <label htmlFor="cdp-email" className="text-sm text-muted">
            Sign in to send
          </label>
          <input
            id="cdp-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputCls}
          />
          <button type="submit" disabled={busy || !email} className={btnCls}>
            {busy ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtp} className="flex flex-wrap items-center gap-2">
          <label htmlFor="cdp-otp" className="text-sm text-muted">
            Enter the 6-digit code
          </label>
          <input
            id="cdp-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className={`${inputCls} font-mono tracking-widest`}
          />
          <button type="submit" disabled={busy || otp.length !== 6} className={btnCls}>
            {busy ? "Verifying…" : "Verify"}
          </button>
        </form>
      )}
      {error && <p className="mt-2 font-mono text-xs text-amber-600 dark:text-amber-400">{error}</p>}
    </div>
  );
}
