# lib/cdp — Coinbase Developer Platform integration

**Built with the Coinbase Developer Platform MCP + `solana-dev` (build phase).**
Verified: CDP supports Solana embedded wallets + Solana USDC on-ramp.

## What's implemented
- `config.ts` — `isCdpConfigured` gate (reads `NEXT_PUBLIC_CDP_PROJECT_ID`).
- `../../app/components/cdp-provider.tsx` — mounts `CDPHooksProvider` only when configured;
  otherwise renders children untouched (app runs with zero CDP setup).
- `../../app/components/wallet-bar.tsx` — embedded-wallet onboarding: email → OTP sign-in
  (`useSignInWithEmail` / `useVerifyEmailOTP`), auto-creates a Solana account
  (`useCreateSolanaAccount`), shows the address, and an "Add funds (USD→USDC)" button.
- `auth.ts` + `camel.ts` — server JWT (`@coinbase/cdp-sdk/auth`) + snake→camel helper.
- `../../app/api/onramp/buy-options` + `buy-quote` — proxy CDP's Onramp API server-side;
  `buy-quote` returns a one-click `onrampUrl` (USDC on `purchaseNetwork: "solana"`).

> Note: `@coinbase/cdp-react` (prebuilt UI) is NOT used — it peers `react <19.2.0` and
> conflicts with this project's React 19.2.3. We use the headless `@coinbase/cdp-hooks`
> with our own on-brand UI instead.

## Activation checklist (account config — required to actually fund)
This integration is gated; it stays off until you complete CDP Portal setup:
1. Create a project at https://portal.cdp.coinbase.com and copy the **Project ID**.
2. Create a **Secret API Key** (API Key ID + Secret).
3. **Allowlist your domain** (e.g. `http://localhost:3000`) under Embedded Wallets → Security.
4. Put these in `.env.local`:
   - `NEXT_PUBLIC_CDP_PROJECT_ID`, `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`
5. Onramp runs in **trial mode** by default; enable mock buys to test without real money.
   Devnet USDC faucet (CDP) is available for transfer testing.

## Compliance posture
SolRemit is a software front-end on CDP's licensed rails for the MVP — we do NOT
self-hold money-transmitter licensing. Off-ramp (USDC → MXN) goes through a separate
licensed MXN partner (`OFFRAMP_PARTNER_*` in `.env`). Keep secrets server-side; only
`NEXT_PUBLIC_CDP_PROJECT_ID` is exposed to the client.
