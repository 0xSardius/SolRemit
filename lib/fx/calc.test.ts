import { describe, expect, it } from "vitest";
import { computeFxBreakdown, illustrativeBenchmark } from "./calc";
import type { FxCalcInput } from "./types";

// Based on a real observed quote: $100 -> ~1743.84 MXNe, mid ~17.506 MXN/USD.
const base: FxCalcInput = {
  sendAmountUsd: 100,
  usdcSwapped: 99, // after a 1% on-ramp fee
  localOut: 1726.4, // 99 USDC swapped (~17.438 effective)
  priceImpactPct: -0.0000355,
  jupiterFeeBps: 10,
  midMarketRate: 17.506,
  onRamp: { pct: 0.01, fixed: 0 },
  offRamp: { pct: 0.005, fixed: 0 },
  networkFeeUsd: 0.01,
  platformFeeBps: 0,
};

describe("computeFxBreakdown", () => {
  it("nets the off-ramp fee out of the local proceeds", () => {
    const r = computeFxBreakdown(base);
    // 1726.4 * (1 - 0.005) = 1717.768
    expect(r.localLanded).toBeCloseTo(1717.768, 3);
  });

  it("derives an all-in effective rate below mid-market", () => {
    const r = computeFxBreakdown(base);
    expect(r.effectiveRate).toBeCloseTo(17.17768, 4);
    expect(r.spreadVsMidPct).toBeGreaterThan(0);
    expect(r.effectiveRate).toBeLessThan(base.midMarketRate);
  });

  it("attributes fees and sums them consistently", () => {
    const r = computeFxBreakdown(base);
    const f = r.feesUsd;
    expect(f.onRamp).toBeCloseTo(1, 6); // 1% of $100
    expect(f.network).toBe(0.01);
    expect(f.total).toBeCloseTo(
      f.onRamp + f.fx + f.network + f.offRamp,
      6,
    );
    // All-in cost should be a small single-digit percentage.
    expect(r.totalCostPct).toBeGreaterThan(0);
    expect(r.totalCostPct).toBeLessThan(5);
  });

  it("computes positive savings vs a costlier benchmark", () => {
    const r = computeFxBreakdown({
      ...base,
      benchmark: illustrativeBenchmark(base.midMarketRate, "westernUnion"),
    });
    expect(r.savings).toBeDefined();
    expect(r.savings!.benchmarkLabel).toBe("Western Union");
    expect(r.savings!.savingsLocal).toBeGreaterThan(0);
    expect(r.savings!.savingsPct).toBeGreaterThan(0);
  });

  it("books the SolRemit markup as revenue and reduces what the recipient gets", () => {
    const noFee = computeFxBreakdown(base);
    const withFee = computeFxBreakdown({ ...base, platformFeeBps: 35 });
    // 0.35% of $100 = $0.35 revenue.
    expect(withFee.feesUsd.platform).toBeCloseTo(0.35, 6);
    expect(noFee.feesUsd.platform).toBe(0);
    // Recipient gets less; total cost rises by exactly the fee.
    expect(withFee.localLanded).toBeLessThan(noFee.localLanded);
    expect(withFee.feesUsd.total).toBeCloseTo(noFee.feesUsd.total + 0.35, 6);
  });

  it("handles a zero send amount without dividing by zero", () => {
    const r = computeFxBreakdown({ ...base, sendAmountUsd: 0, localOut: 0 });
    expect(r.effectiveRate).toBe(0);
    expect(r.totalCostPct).toBe(0);
    expect(Number.isFinite(r.feesUsd.total)).toBe(true);
  });
});
