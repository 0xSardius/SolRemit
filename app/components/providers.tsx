"use client";

import { SolanaProvider } from "@solana/react-hooks";
import { PropsWithChildren } from "react";

import { autoDiscover, createClient } from "@solana/client";

// RPC endpoint. Point NEXT_PUBLIC_SOLANA_RPC_URL at a Helius endpoint for
// production-grade rate limits; falls back to the public devnet RPC for local dev.
const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

// NOTE (build phase): senders use Coinbase CDP embedded wallets (email/social,
// no seed phrase). autoDiscover() (Wallet Standard) stays as the dev fallback and
// "connect existing wallet" path. The CDP embedded connector is wired in the
// build phase — see .superstack/build-context.md and lib/cdp/.
const client = createClient({
  endpoint,
  walletConnectors: autoDiscover(),
});

export function Providers({ children }: PropsWithChildren) {
  return <SolanaProvider client={client}>{children}</SolanaProvider>;
}
