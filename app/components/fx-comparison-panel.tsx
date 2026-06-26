"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Num } from "./num";
import { formatFiat, formatPercent, formatRate } from "@/lib/format/number";

interface FxResponse {
  sendAmountUsd: number;
  destination: { symbol: string; mint: string; trust: { ok: boolean; warnings: string[] } };
  route: string;
  quote: { priceImpactPct: string; feeBps: number };
  breakdown: {
    midMarketRate: number;
    effectiveRate: number;
    spreadVsMidPct: number;
    localLanded: number;
    feesUsd: { onRamp: number; fx: number; network: number; offRamp: number; platform: number; total: number };
    totalCostPct: number;
  };
  benchmarks: { label: string; landedLocal: number; savingsLocal: number }[];
  assumptions: { note: string };
}

type Status = "loading" | "success" | "error";

export function FxComparisonPanel() {
  const [amount, setAmount] = useState("200");
  const [data, setData] = useState<FxResponse | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const fetchQuote = useCallback(async (usd: number) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/fx/quote?usd=${usd}`, { signal: ctrl.signal });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Quote failed");
      setData(json as FxResponse);
      setStatus("success");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Quote failed");
      setStatus("error");
    }
  }, []);

  // Debounce input -> quote.
  useEffect(() => {
    const usd = Number(amount);
    if (!Number.isFinite(usd) || usd <= 0) return;
    const id = setTimeout(() => fetchQuote(usd), 400);
    return () => clearTimeout(id);
  }, [amount, fetchQuote]);

  const b = data?.breakdown;

  return (
    <section className="w-full max-w-xl space-y-5 rounded-2xl border border-border-low bg-card p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.4)]">
      {/* Amount input */}
      <div className="space-y-2">
        <label htmlFor="send-usd" className="text-sm font-medium text-muted">
          You send
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border-low bg-bg1 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/40">
          <span className="font-mono text-lg text-muted" aria-hidden>$</span>
          <input
            id="send-usd"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full bg-transparent font-mono text-2xl tabular-nums outline-none"
            aria-describedby="send-help"
          />
          <span className="text-sm font-medium text-muted">USD → MXN</span>
        </div>
        <p id="send-help" className="text-xs text-muted">
          Live route via Jupiter. Mid-market rate, every fee, and what your recipient
          actually receives — nothing hidden.
        </p>
      </div>

      {/* Result */}
      <div aria-live="polite" className="min-h-[18rem]">
        {status === "loading" && <PanelSkeleton />}

        {status === "error" && (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-border-low bg-bg1 p-5">
            <p className="text-sm text-foreground">Couldn’t fetch a live quote.</p>
            <p className="font-mono text-xs text-muted">{error}</p>
            <button
              onClick={() => fetchQuote(Number(amount))}
              className="rounded-lg border border-border-low bg-card px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Try again
            </button>
          </div>
        )}

        {status === "success" && data && b && (
          <div className="space-y-5">
            {/* Hero: recipient gets */}
            <div className="rounded-xl border border-border-low bg-bg1 p-5">
              <p className="text-sm text-muted">Recipient gets</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                <Num result={formatFiat(b.localLanded, "MXN", "detailed")} />
                <span className="ml-2 text-base font-normal text-muted">
                  {data.destination.symbol}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-cream px-2.5 py-1">
                  Route: {data.route}
                </span>
                <span className="rounded-full bg-cream px-2.5 py-1">
                  Price impact{" "}
                  <Num result={formatPercent(Math.abs(Number(data.quote.priceImpactPct) * 100))} />
                </span>
              </div>
              {!data.destination.trust.ok && (
                <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                  ⚠ {data.destination.symbol}: {data.destination.trust.warnings.join("; ")}.
                  Verified live against the expected mint before routing.
                </p>
              )}
            </div>

            {/* Rates */}
            <dl className="grid grid-cols-3 gap-3 text-center">
              <RateCell label="Mid-market" value={formatRate(b.midMarketRate)} />
              <RateCell label="Your rate" value={formatRate(b.effectiveRate)} emphasize />
              <RateCell label="Spread" value={formatPercent(b.spreadVsMidPct)} />
            </dl>

            {/* Fee breakdown */}
            <div className="space-y-2 rounded-xl border border-border-low p-4">
              <p className="text-sm font-medium">Where every cent goes</p>
              <FeeRow label="On-ramp (Coinbase)" value={b.feesUsd.onRamp} />
              <FeeRow label="FX (Jupiter vs mid-market)" value={b.feesUsd.fx} />
              <FeeRow label="Solana network" value={b.feesUsd.network} />
              <FeeRow label="Off-ramp (MXN partner)" value={b.feesUsd.offRamp} />
              <FeeRow label="SolRemit fee" value={b.feesUsd.platform} />
              <div className="mt-1 flex items-center justify-between border-t border-border-low pt-2 text-sm font-semibold">
                <span>Total cost</span>
                <span>
                  <Num result={formatFiat(b.feesUsd.total, "USD", "detailed")} />
                  <span className="ml-2 text-muted">
                    (<Num result={formatPercent(b.totalCostPct)} />)
                  </span>
                </span>
              </div>
            </div>

            {/* Savings vs incumbents */}
            <div className="space-y-2">
              {data.benchmarks.map((bm) => {
                const saves = bm.savingsLocal >= 0;
                return (
                  <div
                    key={bm.label}
                    className="flex items-center justify-between rounded-lg bg-bg1 px-4 py-2.5 text-sm"
                  >
                    <span className="text-muted">vs {bm.label}</span>
                    <span
                      className={
                        saves
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "font-medium text-amber-600 dark:text-amber-400"
                      }
                    >
                      {saves ? "Recipient gets " : "Costs "}
                      <Num
                        result={formatFiat(Math.abs(bm.savingsLocal), "MXN", "detailed")}
                      />{" "}
                      more
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] leading-relaxed text-muted">{data.assumptions.note}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function RateCell({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: { display: string; raw: string; ariaLabel: string };
  emphasize?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border-low p-3 ${emphasize ? "bg-cream" : "bg-bg1"}`}
    >
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-1 text-lg ${emphasize ? "font-semibold" : ""}`}>
        <Num result={value} />
      </dd>
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <Num result={formatFiat(value, "USD", "detailed")} />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-5 motion-safe:animate-pulse" aria-hidden>
      <div className="h-28 rounded-xl bg-cream" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 rounded-xl bg-cream" />
        <div className="h-16 rounded-xl bg-cream" />
        <div className="h-16 rounded-xl bg-cream" />
      </div>
      <div className="h-32 rounded-xl bg-cream" />
    </div>
  );
}
