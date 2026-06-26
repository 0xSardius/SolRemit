/** Types for the deterministic FX-transparency calculation. */

/** Ramp fee model. pct is a fraction (0.01 = 1%). */
export interface RampFees {
  pct: number;
  fixed: number;
}

export interface FxCalcInput {
  /** Gross USD the sender funds (before the on-ramp fee). */
  sendAmountUsd: number;
  /** Post-on-ramp USDC actually swapped (the amount the quote was fetched for). */
  usdcSwapped: number;
  /** Local-currency units out of the Jupiter swap (decimal, e.g. MXN). */
  localOut: number;
  /** Jupiter price impact as a fraction (e.g. -0.0000355). */
  priceImpactPct: number;
  /** Jupiter fee in bps (e.g. 10 = 0.10%). */
  jupiterFeeBps: number;
  /** Mid-market reference rate: local units per 1 USD. */
  midMarketRate: number;
  onRamp: RampFees;
  /** Off-ramp fees, expressed in LOCAL currency units. */
  offRamp: RampFees;
  /** Solana network cost in USD (tiny). */
  networkFeeUsd: number;
  /** SolRemit's disclosed FX markup in bps (e.g. 35 = 0.35%). This is revenue. */
  platformFeeBps: number;
  /** Optional benchmark to compare against (e.g. Wise/Western Union). */
  benchmark?: { label: string; effectiveRateLocalPerUsd: number };
}

export interface FeeBreakdownUsd {
  onRamp: number;
  fx: number; // spread + Jupiter fee + price impact, vs mid-market
  network: number;
  offRamp: number;
  platform: number; // SolRemit's disclosed markup (revenue)
  total: number;
}

export interface FxBreakdown {
  sendAmountUsd: number;
  midMarketRate: number;
  /** All-in rate the recipient actually receives: localLanded / sendAmountUsd. */
  effectiveRate: number;
  /** How far the all-in rate is below mid-market, as a percentage. */
  spreadVsMidPct: number;
  /** Local currency the recipient receives after every fee. */
  localLanded: number;
  feesUsd: FeeBreakdownUsd;
  /** Total cost as a % of the amount sent. */
  totalCostPct: number;
  savings?: {
    benchmarkLabel: string;
    benchmarkLandedLocal: number;
    savingsLocal: number;
    savingsPct: number;
  };
}
