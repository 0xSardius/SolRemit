# SolRemit

Wise-style cross-border remittance on Solana. Send money **US → Mexico** using
stablecoins, with a built-in fiat on-ramp, a licensed off-ramp, and **transparent FX
routing through Jupiter** — the app shows the live route, mid-market rate, price
impact, and total landed cost side-by-side vs Wise / Western Union.

> Status: scaffolded (Phase 2). Integration-first — no custom on-chain program for the MVP.

## Stack

- **Next.js 16** (App Router) + **Tailwind 4**
- **@solana/client** + **@solana/react-hooks** (framework-kit)
- **Jupiter** — transparent FX routing (`lib/jupiter`)
- **Coinbase CDP** — embedded wallets + fiat on-ramp + KYC (`lib/cdp`)
- **Helius** — RPC / data
- Licensed **MXN off-ramp** partner (per corridor)

## Getting started

```shell
cp .env.example .env.local   # fill in keys
npm install
npm run dev
```

## Layout

```
app/                 # Next.js App Router (UI + API routes)
  components/        # providers (Solana client + wallet)
lib/
  solana/            # @solana/kit client, mints, corridor config
  jupiter/           # FX routing + quotes  (skill: integrating-jupiter)
  cdp/               # on-ramp + embedded wallets (Coinbase CDP)
  fx/                # FX transparency / cost-comparison math
```

See `.superstack/build-context.md` for stack decisions and the build plan, and
`validation-report.html` for the market validation.
