/**
 * GET /api/fx/quote?usd=100
 *
 * The server-side FX-transparency endpoint. Resolves + trust-checks the
 * destination stablecoin, fetches a live Jupiter route, derives the mid-market
 * rate, and returns the full cost breakdown that powers the comparison panel.
 *
 * Keeps JUPITER_API_KEY server-side. Read-only: no transaction is built.
 */

import { NextResponse } from "next/server";
import { MXNE, USDC_MINT_MAINNET, USDC_DECIMALS } from "@/lib/solana/constants";
import {
  describeRoute,
  fromNative,
  getFxQuote,
  getMidMarketRate,
  resolveToken,
  toNative,
} from "@/lib/jupiter";
import { computeFxBreakdown, illustrativeBenchmark } from "@/lib/fx/calc";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SolRemit's disclosed FX markup (revenue), in bps. Configurable via env.
const PLATFORM_FEE_BPS = Number(process.env.SOLREMIT_FEE_BPS ?? 35);

// Illustrative ramp assumptions — replace with live CDP / partner quotes.
const ASSUMPTIONS = {
  onRamp: { pct: 0.01, fixed: 0 }, // Coinbase CDP on-ramp (USD)
  offRamp: { pct: 0.005, fixed: 0 }, // licensed MXN partner (MXN)
  networkFeeUsd: 0.01, // Solana
  platformFeeBps: PLATFORM_FEE_BPS, // SolRemit markup — shown to the user
  note: "Ramp fees are placeholders pending live CDP/partner quotes. SolRemit fee is disclosed in the breakdown.",
};

export async function GET(req: Request) {
  const rl = rateLimit(req, "fx-quote", 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  try {
    const usd = Number(new URL(req.url).searchParams.get("usd") ?? "100");
    if (!Number.isFinite(usd) || usd <= 0 || usd > 50_000) {
      return NextResponse.json(
        { error: "Provide ?usd= between 0 and 50000" },
        { status: 400 },
      );
    }

    // 1) Resolve + trust-check the destination stablecoin (defends vs impostors).
    const resolved = await resolveToken("MXNe", { expectMint: MXNE.mint });
    if (!resolved) {
      return NextResponse.json(
        { error: "Could not resolve destination stablecoin (MXNe)" },
        { status: 502 },
      );
    }

    // 2) Apply on-ramp, then quote the swap for the USDC actually received.
    const usdcSwapped = usd * (1 - ASSUMPTIONS.onRamp.pct) - ASSUMPTIONS.onRamp.fixed;
    const order = await getFxQuote({
      inputMint: USDC_MINT_MAINNET,
      outputMint: MXNE.mint,
      amount: toNative(usdcSwapped, USDC_DECIMALS),
    });
    const localOut = fromNative(order.outAmount, MXNE.decimals);

    // 3) Mid-market reference (fails closed on bad pricing).
    const midMarketRate = await getMidMarketRate(USDC_MINT_MAINNET, MXNE.mint);

    // 4) Deterministic breakdown.
    const breakdown = computeFxBreakdown({
      sendAmountUsd: usd,
      usdcSwapped,
      localOut,
      priceImpactPct: Number(order.priceImpactPct),
      jupiterFeeBps: order.feeBps,
      midMarketRate,
      onRamp: ASSUMPTIONS.onRamp,
      offRamp: ASSUMPTIONS.offRamp,
      networkFeeUsd: ASSUMPTIONS.networkFeeUsd,
      platformFeeBps: ASSUMPTIONS.platformFeeBps,
    });

    const benchmarks = (["wise", "westernUnion"] as const).map((p) => {
      const b = illustrativeBenchmark(midMarketRate, p);
      const landed = usd * b.effectiveRateLocalPerUsd;
      return {
        label: b.label,
        landedLocal: landed,
        savingsLocal: breakdown.localLanded - landed,
      };
    });

    return NextResponse.json({
      sendAmountUsd: usd,
      destination: {
        symbol: resolved.token.symbol,
        mint: resolved.token.id,
        decimals: resolved.token.decimals,
        trust: resolved.trust,
      },
      route: describeRoute(order),
      quote: {
        inAmount: order.inAmount,
        outAmount: order.outAmount,
        priceImpactPct: order.priceImpactPct,
        slippageBps: order.slippageBps,
        feeBps: order.feeBps,
      },
      breakdown,
      benchmarks,
      assumptions: ASSUMPTIONS,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "FX quote failed" },
      { status: 502 },
    );
  }
}
