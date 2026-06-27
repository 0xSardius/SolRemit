# SolRemit — Project Context for Claude Code

## What this is
A Wise-style cross-border remittance app on Solana. Launch corridor: **US → Mexico
(USD → MXN)**. Users send stablecoins (USDC) with a fiat on-ramp, a licensed off-ramp,
and **transparent FX routing via Jupiter**.

**The differentiator IS the product:** a side-by-side panel showing the live Jupiter
route, mid-market rate, price impact, total fees, and total landed cost vs
Wise / Western Union. Build this transparency view first.

## Hard decisions (do not relitigate)
- **Integration-first**: NO custom on-chain program for the MVP. Use Jupiter + CDP + SPL.
- **FX routing**: Jupiter (Token API for mints, Quote/Ultra API for routes).
- **Onboarding**: Coinbase CDP embedded wallets (email/social, no seed phrase) as the
  default sender path; Wallet Standard (`autoDiscover`) is the "connect existing" fallback.
- **Ramps**: CDP for on-ramp + KYC; a separate **licensed MXN partner** for off-ramp.
- **Compliance**: SolRemit is a software front-end on licensed partner rails for the MVP.
  Do NOT design flows that require us to self-hold money-transmitter licensing.
- **Revenue**: transparent FX markup, default 35 bps (`SOLREMIT_FEE_BPS`), shown as a
  "SolRemit fee" line and collected on-chain via Jupiter `referralFee` when
  `SOLREMIT_FEE_ACCOUNT` is set. Beating Wise depends on cheaper ramps, not FX.

## Stack
Next.js 16 (App Router) · Tailwind 4 · @solana/client + @solana/react-hooks · TypeScript.
RPC via `NEXT_PUBLIC_SOLANA_RPC_URL` (Helius). Mints/corridor in `lib/solana/constants.ts`.

## Layout
- `app/` — UI + API routes (`api/fx/{quote,order,execute}`, `api/onramp/{buy-options,buy-quote}`).
  Components: `fx-comparison-panel`, `wallet-bar`, `send-flow`, `cdp-provider`, `num`.
- `lib/solana/` — client, mints (USDC + MXNe; others via Jupiter Token API), corridor.
- `lib/jupiter/` — FX routing, quotes, order (taker), execute (skill: `integrating-jupiter`).
- `lib/cdp/` — embedded wallets + on-ramp + server JWT (Coinbase CDP MCP + `solana-dev`).
- `lib/fx/` — deterministic FX-transparency / savings / markup math (+ unit tests).
- `lib/format/` — number formatting (`number-formatting` spec). `lib/rate-limit.ts` — API throttle.
- Brand: `brand.md` (Forest Stake) → `app/globals.css` tokens.

## Conventions / guardrails
- **Secrets**: never print or commit. `.env*` is gitignored. Client-exposed vars must be
  `NEXT_PUBLIC_*` and contain no secrets (project IDs / RPC URLs only).
- **No guessed mint/contract addresses** — resolve unknown mints from the Jupiter Token API.
- Commit after each working, tested unit. Conventional-commit messages. No Co-Authored-By line.
- Display numbers via `lib/fx` + `number-formatting` rules (never raw float concatenation).

## Skills per area
- FX routing/quotes → `integrating-jupiter`
- Wallet/RPC/transfers → `solana-dev`
- UI / transparency view → `frontend-design`, `frontend-design-guidelines`, `number-formatting`, `brand-design`
- Security pass before real funds → `cso`
- Ship → `review-and-iterate`, `deploy-to-mainnet`

## Status (as of last session)
All MVP slices built and on `origin/main` (https://github.com/0xSardius/SolRemit):
- ✅ Validate (`validate-idea`, GO) · ✅ Scaffold (`scaffold-project`)
- ✅ FX core (`integrating-jupiter`) — quote/order/execute, **live-verified**
- ✅ Transparency UI (`number-formatting` + `frontend-design-guidelines`) — **verified in browser**
- ◑ Wallet + on-ramp (CDP) — built + gated; **needs CDP creds to activate** (see `lib/cdp/README.md`)
- ◑ Send flow — order→sign→execute wired; **needs a funded wallet** for full execution
- ✅ Security (`cso`) — 2 MEDIUM fixed (ws override, rate limiting); report in `.superstack/security-reports/`
- ✅ Brand (`brand-design`) — Forest Stake applied
- ✅ Revenue — transparent 35 bps markup, disclosed + on-chain collectible

**Remaining to launch:** real CDP creds + domain allowlist; select/integrate licensed MXN
off-ramp partner; negotiate cheaper ramps (to beat Wise); deploy (`deploy-to-mainnet`).
See `.superstack/idea-context.md`, `.superstack/build-context.md`, and `validation-report.html`.
