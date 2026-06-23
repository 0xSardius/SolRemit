# lib/cdp — Coinbase Developer Platform integration

**Built with the Coinbase Developer Platform MCP + `solana-dev` (build phase).**

Responsibilities:
- **Embedded wallets**: email/social login, no seed phrase (the default sender
  onboarding path). External Wallet Standard wallets remain a "connect existing"
  option.
- **Fiat on-ramp**: USD → USDC, including KYC handled by CDP's licensed rails.
- Compliance posture: SolRemit is a software front-end on CDP's licensed rails for
  the MVP — we do NOT self-custody licensing. Off-ramp (USDC → MXN bank/cash) goes
  through a separate licensed MXN partner (see OFFRAMP_PARTNER_* in .env).

Keep API secrets server-side (CDP_API_KEY_*). Only NEXT_PUBLIC_CDP_PROJECT_ID is
exposed to the client.
