# SolRemit — Checkpoint

_Last updated: 2026-06-28 · Status: MVP complete (learning project), deployed_

## What this is
Wise-style cross-border remittance on Solana, **US → Mexico (USD → MXN)**. Differentiator:
**radical FX transparency** — show the live Jupiter route, mid-market rate, every fee, and the
recipient's landed amount, side-by-side vs Wise / Western Union. Integration-first (no custom
on-chain program). Built end-to-end as a learning exercise using the solana-new skill suite.

- **Repo:** https://github.com/0xSardius/SolRemit · branch `main` · 11 commits · tree clean, pushed
- **Deployed:** yes (Vercel). FX panel + EN/ES + How-it-works + FAQ work with **zero credentials**.

## Status by area
| Area | State | Notes |
|---|---|---|
| Validate / scaffold | ✅ | `validate-idea` (GO), `scaffold-project` (Next 16 + @solana/kit) |
| FX core | ✅ live-verified | `lib/jupiter` + `lib/fx`, `/api/fx/{quote,order,execute}` |
| Transparency UI | ✅ verified | `fx-comparison-panel`, `number-formatting` spec |
| Wallet + on-ramp (CDP) | ◑ gated | built; needs CDP creds + domain allowlist to activate |
| Send flow | ◑ wired | order→sign→execute; needs a funded wallet for full exec |
| Security | ✅ | `cso` daily audit; ws override + API rate limiting applied |
| Brand | ✅ | Forest Stake palette (`brand.md`, `globals.css`) |
| Revenue | ✅ | transparent 35bps markup, disclosed + on-chain collectible |
| i18n | ✅ | EN/ES toggle, How-it-works, FAQ (no creds needed) |
| Off-ramp partner | ⬜ | stub — select + integrate licensed MXN partner |

## Where things live
- `app/` — UI + API routes. Components: `top-bar`, `hero`, `how-it-works`, `faq`,
  `fx-comparison-panel`, `wallet-bar`, `send-flow`, `cdp-provider`, `lang-provider`, `num`.
- `lib/` — `jupiter/` (FX), `fx/` (breakdown + markup math + tests), `cdp/`, `solana/`,
  `format/`, `i18n/`, `rate-limit.ts`.
- Context: `CLAUDE.md`, `brand.md`, `.superstack/{idea-context,build-context}.md`,
  `.superstack/security-reports/SolRemit-2026-06-26.md`, `validation-report.html`.

## Run / activate
```bash
npm install && cp .env.example .env.local && npm run dev   # FX panel works as-is
npm test && npm run build                                  # 6 fx tests; clean build
```
To activate wallet/on-ramp/send: set `NEXT_PUBLIC_CDP_PROJECT_ID`, `CDP_API_KEY_ID`,
`CDP_API_KEY_SECRET` (Vercel env for prod) + allowlist the domain in CDP Portal. Revenue
collection: set `SOLREMIT_FEE_ACCOUNT` (+ `SOLREMIT_FEE_BPS`, default 35). See `lib/cdp/README.md`.

## Resume here next session
Pick up from any of:
1. **Make the live flow work** — add CDP creds to Vercel + allowlist the `*.vercel.app` domain.
2. **Bilingual the gated flow** — translate `wallet-bar` / `send-flow` strings (keys exist in `lib/i18n`).
3. **Off-ramp** — select a licensed MXN partner and replace the stub.
4. **Business modeling** — ramp rev-share / B2B economics (the path to beating Wise = cheaper rails).
5. **Launch polish** — demo banner/disclaimer ribbon, marketing tweet + screen-recording.

## Honest take (recorded)
Technically sound and cheap to test, but as a generic consumer Wise-clone the odds of "good
income" are low — the moat is distribution + trust + licensing, not code. A wedge (on-chain-native
recipients who stay in stablecoins, a niche with distribution, or B2B payouts) is the plausible
path. See memory `solremit-revenue-model` and the last session's analysis.
