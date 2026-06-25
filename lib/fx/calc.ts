/**
 * Deterministic FX-transparency math. Pure (no network) so it can be unit-tested
 * and reasoned about. This is the heart of SolRemit's "radical transparency"
 * promise: every number the comparison panel shows is computed here.
 */

import type { FxBreakdown, FxCalcInput } from "./types";

export function computeFxBreakdown(input: FxCalcInput): FxBreakdown {
  const {
    sendAmountUsd,
    usdcSwapped,
    localOut,
    midMarketRate,
    onRamp,
    offRamp,
    networkFeeUsd,
    benchmark,
  } = input;

  // Off-ramp takes a cut of the local proceeds.
  const localLanded = Math.max(
    0,
    localOut * (1 - offRamp.pct) - offRamp.fixed,
  );

  // All-in rate the recipient effectively gets per USD funded.
  const effectiveRate = sendAmountUsd > 0 ? localLanded / sendAmountUsd : 0;
  const spreadVsMidPct =
    midMarketRate > 0
      ? ((midMarketRate - effectiveRate) / midMarketRate) * 100
      : 0;

  // Fee attribution, all normalised to USD.
  const onRampUsd = sendAmountUsd * onRamp.pct + onRamp.fixed;

  // FX cost = the USDC that was swapped, minus what those local units are worth
  // at mid-market. Captures spread + Jupiter fee + price impact in one figure.
  const fxUsd = Math.max(0, usdcSwapped - localOut / midMarketRate);

  const offRampUsd = (localOut - localLanded) / midMarketRate;

  const total = onRampUsd + fxUsd + networkFeeUsd + offRampUsd;

  const breakdown: FxBreakdown = {
    sendAmountUsd,
    midMarketRate,
    effectiveRate,
    spreadVsMidPct,
    localLanded,
    feesUsd: {
      onRamp: onRampUsd,
      fx: fxUsd,
      network: networkFeeUsd,
      offRamp: offRampUsd,
      total,
    },
    totalCostPct: sendAmountUsd > 0 ? (total / sendAmountUsd) * 100 : 0,
  };

  if (benchmark) {
    const benchmarkLandedLocal =
      sendAmountUsd * benchmark.effectiveRateLocalPerUsd;
    const savingsLocal = localLanded - benchmarkLandedLocal;
    breakdown.savings = {
      benchmarkLabel: benchmark.label,
      benchmarkLandedLocal,
      savingsLocal,
      savingsPct:
        benchmarkLandedLocal > 0
          ? (savingsLocal / benchmarkLandedLocal) * 100
          : 0,
    };
  }

  return breakdown;
}

/**
 * ILLUSTRATIVE benchmark rates — placeholders for the comparison panel until we
 * wire a live rate feed for incumbents. Expressed as effective local-per-USD the
 * recipient nets after that provider's fees + spread. Replace with real data
 * before making public "you save $X" claims.
 */
export function illustrativeBenchmark(
  midMarketRate: number,
  provider: "wise" | "westernUnion",
): { label: string; effectiveRateLocalPerUsd: number } {
  // All-in cost assumptions (fee + spread) — clearly placeholders.
  const allInCost = provider === "wise" ? 0.012 : 0.05;
  const label = provider === "wise" ? "Wise" : "Western Union";
  return { label, effectiveRateLocalPerUsd: midMarketRate * (1 - allInCost) };
}
