/**
 * POST /api/fx/execute  { signedTransaction, requestId }
 * Submits a signed Ultra order to Jupiter for on-chain settlement.
 */

import { NextResponse } from "next/server";
import { executeOrder } from "@/lib/jupiter";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { signedTransaction?: string; requestId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.signedTransaction || !body.requestId) {
    return NextResponse.json(
      { error: "signedTransaction and requestId are required" },
      { status: 400 },
    );
  }

  try {
    const result = await executeOrder({
      signedTransaction: body.signedTransaction,
      requestId: body.requestId,
    });
    const ok = result.status === "Success";
    return NextResponse.json(result, { status: ok ? 200 : 502 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Execute failed" },
      { status: 502 },
    );
  }
}
