"use client";

import { useState } from "react";
import {
  useIsSignedIn,
  useSignSolanaTransaction,
  useSolanaAddress,
} from "@coinbase/cdp-hooks";
import { isCdpConfigured } from "@/lib/cdp/config";
import { formatFiat, formatPercent } from "@/lib/format/number";
import { Num } from "./num";

/** Gate so CDP hooks only run when the provider is mounted. */
export function SendFlow() {
  if (!isCdpConfigured) return null; // wallet bar already explains how to enable
  return <SendFlowInner />;
}

interface OrderSummary {
  inUsdc: number;
  outLocal: number;
  destinationSymbol: string;
  route: string;
  priceImpactPct: string;
}

type Step = "form" | "review" | "sending" | "done";

function SendFlowInner() {
  const { isSignedIn } = useIsSignedIn();
  const { solanaAddress } = useSolanaAddress();
  const { signSolanaTransaction } = useSignSolanaTransaction();

  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("50");
  const [recipient, setRecipient] = useState("");
  const [order, setOrder] = useState<{ transaction: string; requestId: string; summary: OrderSummary } | null>(null);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  if (!isSignedIn) {
    return (
      <p className="rounded-lg border border-border-low bg-bg1 px-4 py-2.5 text-xs text-muted">
        Sign in above to send a transfer.
      </p>
    );
  }

  async function review() {
    setError("");
    const usd = Number(amount);
    if (!Number.isFinite(usd) || usd <= 0) return setError("Enter a valid amount");
    if (!solanaAddress) return setError("Wallet not ready");
    try {
      const res = await fetch(`/api/fx/order?usd=${usd}&taker=${solanaAddress}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not build order");
      setOrder(json);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Order failed");
    }
  }

  // Explicit approval step (solana-dev guardrail): user reviews, then confirms.
  async function confirmSend() {
    if (!order || !solanaAddress) return;
    setStep("sending");
    setError("");
    try {
      const { signedTransaction } = await signSolanaTransaction({
        solanaAccount: solanaAddress,
        transaction: order.transaction,
      });
      const res = await fetch("/api/fx/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedTransaction, requestId: order.requestId }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "Success") {
        throw new Error(json.error ?? `Status: ${json.status ?? "failed"}`);
      }
      setSignature(json.signature ?? "");
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
      setStep("review");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border-low bg-bg1 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
  const btnPrimary =
    "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60";
  const btnGhost =
    "rounded-lg border border-border-low bg-card px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/40";

  return (
    <section className="w-full max-w-xl space-y-4 rounded-2xl border border-border-low bg-card p-6">
      <h2 className="text-lg font-semibold">Send to Mexico</h2>

      {step === "form" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="send-amt" className="text-sm text-muted">Amount (USDC)</label>
            <input
              id="send-amt"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className={`${inputCls} font-mono`}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="send-recip" className="text-sm text-muted">
              Recipient CLABE / name (settled by licensed MXN partner)
            </label>
            <input
              id="send-recip"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. 0021 8001 2345 6789 01"
              autoComplete="off"
              className={inputCls}
            />
          </div>
          <button onClick={review} className={btnPrimary}>Review</button>
        </div>
      )}

      {step !== "form" && order && (
        <div className="space-y-3">
          <dl className="space-y-2 rounded-xl border border-border-low p-4 text-sm">
            <Row label="You send"><Num result={formatFiat(order.summary.inUsdc, "USD")} /> USDC</Row>
            <Row label="Recipient gets">
              <Num result={formatFiat(order.summary.outLocal, "MXN")} /> {order.summary.destinationSymbol}
            </Row>
            <Row label="Route">{order.summary.route}</Row>
            <Row label="Price impact">
              <Num result={formatPercent(Math.abs(Number(order.summary.priceImpactPct) * 100))} />
            </Row>
            {recipient && <Row label="To">{recipient}</Row>}
          </dl>

          {step === "done" ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
              <p className="font-medium text-emerald-700 dark:text-emerald-300">Sent ✓</p>
              {signature && (
                <a
                  href={`https://solscan.io/tx/${signature}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs underline underline-offset-2"
                >
                  {signature.slice(0, 8)}…{signature.slice(-8)}
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={confirmSend} disabled={step === "sending"} className={btnPrimary}>
                {step === "sending" ? "Signing & sending…" : "Confirm & send"}
              </button>
              <button onClick={() => setStep("form")} disabled={step === "sending"} className={btnGhost}>
                Back
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="font-mono text-xs text-amber-600 dark:text-amber-400">{error}</p>}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
