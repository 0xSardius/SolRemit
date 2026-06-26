/** Executable FX quote via Jupiter Ultra /order (no taker => pure quote). */

import { jupiterFetch } from "./client";
import type { JupiterOrder } from "./types";

export interface FxQuoteParams {
  inputMint: string;
  outputMint: string;
  /** Input amount in native units (integer string). */
  amount: string;
  slippageBps?: number;
  /**
   * The taker's wallet address. Omit for a pure quote (transparency panel).
   * Provide it to get back a signable base64 `transaction` + `requestId` for execution.
   */
  taker?: string;
}

/**
 * Fetch an Ultra order. Without a `taker` it's a pure quote (no transaction).
 * With a `taker` the response includes a base64 `transaction` and `requestId`
 * ready for sign -> execute.
 */
export async function getFxQuote(params: FxQuoteParams): Promise<JupiterOrder> {
  const qs = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
  });
  if (params.slippageBps != null) qs.set("slippageBps", String(params.slippageBps));
  if (params.taker) qs.set("taker", params.taker);

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
