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

## Stack
Next.js 16 (App Router) · Tailwind 4 · @solana/client + @solana/react-hooks · TypeScript.
RPC via `NEXT_PUBLIC_SOLANA_RPC_URL` (Helius). Mints/corridor in `lib/solana/constants.ts`.

## Layout
- `app/` — UI + API routes. `app/components/providers.tsx` wraps the Solana client.
- `lib/solana/` — client, mints (USDC hardcoded; others via Jupiter Token API), corridor.
- `lib/jupiter/` — FX routing + quotes (skill: `integrating-jupiter`).
- `lib/cdp/` — on-ramp + embedded wallets (Coinbase CDP MCP + `solana-dev`).
- `lib/fx/` — deterministic FX-transparency / savings math (+ `number-formatting`).

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

## Journey
Phase 1 Idea ✅ (validate-idea, GO) → Phase 2 Scaffold ✅ → **Phase 3 Build** (next:
build-with-claude / integrating-jupiter) → Phase 4 Harden/Ship.
See `.superstack/idea-context.md` and `.superstack/build-context.md`.
