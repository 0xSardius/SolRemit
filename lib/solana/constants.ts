/**
 * Solana token + corridor constants for SolRemit.
 *
 * Mints: USDC mainnet is the canonical, well-known address. Other stablecoin
 * mints (EURC, MXN-pegged stables) are intentionally NOT hardcoded here — they
 * are resolved at build time from the Jupiter Token API to avoid shipping a
 * wrong/guessed address. See lib/jupiter/ (built via the `integrating-jupiter` skill).
 */

export const USDC_MINT_MAINNET =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Devnet USDC (Circle's devnet faucet mint) — for local testing only.
export const USDC_MINT_DEVNET =
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export const USDC_DECIMALS = 6;

/**
 * MXNe ("Real MXN") — the destination stablecoin for the US->MX corridor.
 * Mint confirmed live via the Jupiter Token API (NOT guessed). Note: at time of
 * writing it is not on Jupiter's `verified` list and has a low organic score, and
 * the symbol "MXN" is heavily impersonated by pump.fun tokens — so the app ALWAYS
 * re-resolves + trust-checks this via lib/jupiter/resolveToken at request time and
 * cross-checks against this expected mint.
 */
export const MXNE = {
  symbol: "MXNe",
  mint: "6zYgzrT7X2wi9a9NeMtUvUWLLmf2a8vBsbYkocYdB9wa",
  decimals: 9,
} as const;

/**
 * The launch corridor (wedge). Everything ships for US→Mexico first.
 * Add corridors here only once liquidity + a licensed off-ramp partner exist.
 */
export const LAUNCH_CORRIDOR = {
  id: "us-mx",
  from: { country: "US", fiat: "USD" },
  to: { country: "MX", fiat: "MXN" },
  // Settlement asset moved on-chain between ramps.
  settlementMint: USDC_MINT_MAINNET,
} as const;

export type Corridor = typeof LAUNCH_CORRIDOR;
