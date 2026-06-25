# Build Context — SolRemit

Phase 2 (Scaffold) output. Read by build-with-claude / integrating-jupiter (Phase 3).

## stack
- framework: Next.js 16 (App Router) + Tailwind 4 + TypeScript
- solana: @solana/client + @solana/react-hooks (framework-kit). RPC via NEXT_PUBLIC_SOLANA_RPC_URL (Helius).
- starter_repo: gh:solana-foundation/templates/kit/nextjs (via create-solana-dapp 4.8.5)
- protocols:
  - Jupiter — FX routing/quotes (Token API for mints, Quote/Ultra API for routes). Health: dominant Solana aggregator, ~$2B+ daily volume.
  - Coinbase CDP — embedded wallets + fiat on-ramp + KYC (MCP connected at account level).
  - Licensed MXN off-ramp partner — TBD (selection is a Phase 3 task).
- skills:
  - integrating-jupiter (FX core)
  - solana-dev (wallet/RPC/transfers)
  - frontend-design, frontend-design-guidelines, number-formatting, brand-design (UI)
  - cso (security), review-and-iterate, deploy-to-mainnet (ship)
- mcps:
  - Coinbase Developer Platform (connected, account-level)
  - Helius (template in .mcp.json.example — confirm package + key before enabling)

## architecture
- pattern: "Next.js + Protocol SDKs (no Anchor)" — integration-first, no custom program for MVP.
- key_decisions:
  - Onboarding: CDP embedded wallets default; Wallet Standard autoDiscover() fallback.
  - Compliance: software front-end on licensed partner rails; do not self-license for MVP.
  - No hardcoded mints except canonical USDC; resolve others via Jupiter Token API.
  - Differentiator built first: FX transparency / savings-vs-Wise panel (lib/fx + lib/jupiter).
- folders: app/ (UI+API), lib/{solana,jupiter,cdp,fx}/ (each README maps to its skill).

## build_status
- mvp_complete: false
- tests_passing: true   # lib/fx unit tests (5 passing)
- devnet_deployed: false
- fx_core_complete: true # lib/jupiter + lib/fx + /api/fx/quote, verified live end-to-end

## progress_log
- Phase 3 slice 1 (integrating-jupiter): FX core shipped. Verified live: $200 USD ->
  ~3435 MXN, 1.86% all-in, route via Orca Whirlpool, mid-market from Price v3.
  KEY FINDING: at illustrative rails (1% on-ramp + 0.5% off-ramp), SolRemit beats
  Western Union but loses to Wise by ~0.7% — ramp fees dominate, Jupiter FX is
  near-mid (~0.4%). Beating Wise requires cheaper CDP/partner rails. MXNe is the
  only real MXN stable and is NOT verified on Jupiter — trust-check surfaces this.

## next_phase_plan (Phase 3 — Build)
1. integrating-jupiter: resolve mints (USDC/EURC/MXN-stable) + fetch a real quote with route + price impact + landed cost.
2. lib/fx: deterministic savings-vs-benchmark math; unit test it.
3. UI: build the transparency/comparison panel (frontend-design + number-formatting).
4. CDP: wire embedded-wallet onboarding + USD→USDC on-ramp.
5. Off-ramp: select + integrate licensed MXN partner.
6. cso security pass before any real funds.

## git
- remote: https://github.com/0xSardius/SolRemit.git (origin)
- first commit + push: done at end of Phase 2 scaffold.
