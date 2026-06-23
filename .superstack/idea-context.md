# Idea Context — SolRemit

## Idea
Wise-style cross-border remittance app on Solana. Users send money across borders using
fiat stablecoins (USDC / EURC / local stables). Built-in local fiat on-ramps and off-ramps,
with transparent FX routing through Jupiter (live route + mid-market rate + price impact +
total landed cost shown to the user).

## Decisions locked
- **Ramp strategy:** Coinbase CDP for fiat on-ramp + KYC (MCP already connected). Off-ramp via
  a licensed partner per corridor.
- **FX routing:** Jupiter (Ultra Swap / quote API) for USDC↔EURC↔local stablecoin routing.
- **Build approach:** Integration-first. No custom on-chain program for MVP.
- **Entry point chosen:** Validate first → then scaffold → build.
- **Wedge corridor LOCKED:** US → Mexico (USD → MXN). World's largest remittance corridor (~$65B/yr), deep USDC liquidity, MXN off-ramp partners available. Stablecoins: USDC primary; MXN off-ramp via licensed partner. FX path on Jupiter: USDC → (USDC payout or MXN-stable if available) with full route/price-impact transparency.

## validation
- demand_signals:
  - Non-USD stablecoin senders on Solana nearly TRIPLED YoY (EURC + BRZ), Dune via The Defiant, Apr 2026 — strongest signal (real on-chain users).
  - Incumbents entering with budget: Western Union USDPT on Solana (Mar 2026) + "Stable by Western Union" in 40+ countries; MoneyGram stablecoin app to ~50M users.
  - ~$390B stablecoin payment volume in 2025 (~2x YoY); remittances ~3% of $200T cross-border; circulation projected >$1T by late 2026.
  - Live Solana products prove model: Sphere (120+ countries, USD/EUR/MXN), Decaf, KAST.
- risks:
  - { category: regulatory, description: "MTL/FinCEN MSB (12-24mo), MiCA authorization (by Jul 1 2026), KYC/AML + Travel Rule. Do NOT self-license for MVP — ride licensed partner rails (Coinbase CDP + corridor off-ramp partner).", severity: high }
  - { category: market, description: "Crowded field (Sphere, Decaf, KAST, Western Union, MoneyGram). A generic clone has no wedge.", severity: high }
  - { category: technical, description: "Off-ramp coverage and FX/stablecoin liquidity vary by corridor.", severity: medium }
  - { category: market, description: "No demonstrated unfair advantage yet — must pick a corridor/segment where founder has an edge.", severity: medium }
- go_no_go: "go"
- confidence: 0.7
- next_steps:
  - Pick ONE wedge corridor + underserved segment before scaffolding (e.g. US→MX USD→MXN, or EU→NG EUR→NGN).
  - Confirm partner-ride compliance posture (Coinbase CDP on-ramp/KYC + licensed off-ramp partner).
  - Spike the FX core with integrating-jupiter: real USDC→EURC/local quote w/ route + price impact + total cost.
  - Scaffold with scaffold-project.
  - Build the FX-transparency comparison UI first (side-by-side vs Wise/WU) — it's the differentiator.
  - Run cso security audit before handling real funds.

## Differentiator (the wedge)
Win on **radical FX transparency**: show the live Jupiter route, mid-market rate, price impact,
and total landed cost side-by-side vs Wise/Western Union. That comparison IS the product.
Ship ONE corridor first, not "send anywhere."

## Phase
Phase 1 (Idea) COMPLETE → verdict GO → proceed to Phase 2 (Scaffold).
