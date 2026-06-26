/** Jupiter Ultra execute: submit a signed order for on-chain settlement. */

import { jupiterFetch } from "./client";

export interface ExecuteParams {
  /** Base64 signed transaction (signed by the taker's wallet). */
  signedTransaction: string;
  /** requestId from the GET /ultra/v1/order response. */
  requestId: string;
}

export interface ExecuteResult {
  status: string; // e.g. "Success"
  signature?: string;
  slot?: number;
  code?: number;
  error?: string;
}

/**
 * POST /ultra/v1/execute. Jupiter broadcasts + confirms; we just submit the
 * signed payload + requestId. Treat any non-"Success" status as a failure.
 *
 * Note: Ultra is being superseded by Swap V2 in Jupiter's docs, but remains the
 * supported aggregator path today. Revisit before mainnet launch.
 */
export async function executeOrder(params: ExecuteParams): Promise<ExecuteResult> {
  const res = await jupiterFetch<ExecuteResult>("/ultra/v1/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res;
}
