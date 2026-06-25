/** Executable FX quote via Jupiter Ultra /order (no taker => pure quote). */

import { jupiterFetch } from "./client";
import type { JupiterOrder } from "./types";

export interface FxQuoteParams {
  inputMint: string;
  outputMint: string;
  /** Input amount in native units (integer string). */
  amount: string;
  slippageBps?: number;
}

/**
 * Fetch an Ultra order without a `taker`, so no transaction is built — we only
 * read the route, amounts, price impact, and fees for the transparency panel.
 */
export async function getFxQuote(params: FxQuoteParams): Promise<JupiterOrder> {
  const qs = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
  });
  if (params.slippageBps != null) qs.set("slippageBps", String(params.slippageBps));

  const order = await jupiterFetch<JupiterOrder>(`/ultra/v1/order?${qs}`);
  if (order.error || order.errorCode != null) {
    throw new Error(`Jupiter quote failed: ${order.error ?? order.errorCode}`);
  }
  if (!order.outAmount || Number(order.outAmount) <= 0) {
    throw new Error("Jupiter returned an empty route (no liquidity?)");
  }
  return order;
}

/** Human-readable route, e.g. "Whirlpool -> Whirlpool". */
export function describeRoute(order: JupiterOrder): string {
  const labels = (order.routePlan ?? []).map((h) => h.swapInfo.label);
  return labels.length ? Array.from(new Set(labels)).join(" + ") : "direct";
}
