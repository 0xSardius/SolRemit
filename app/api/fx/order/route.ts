/**
 * GET /api/fx/order?usd=50&taker=<solanaAddress>
 * Builds a signable USDC->MXNe order for the taker. Returns the base64
 * `transaction` + `requestId` for the sign -> execute step, plus a summary.
 */

import { NextResponse } from "next/server";
import { MXNE, USDC_MINT_MAINNET, USDC_DECIMALS } from "@/lib/solana/constants";
import { describeRoute, fromNative, getFxQuote, toNative } from "@/lib/jupiter";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SolRemit fee collection. Set SOLREMIT_FEE_ACCOUNT to a referral token account to
// collect the markup on-chain at swap time (Jupiter takes a cut of integrator fees).
const FEE_BPS = Number(process.env.SOLREMIT_FEE_BPS ?? 35);
const FEE_ACCOUNT = process.env.SOLREMIT_FEE_ACCOUNT ?? "";

export async function GET(req: Request) {
  const rl = rateLimit(req, "fx-order", 20);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  try {
    const url = new URL(req.url);
    const usd = Number(url.searchParams.get("usd") ?? "0");
    const taker = url.searchParams.get("taker") ?? "";

    if (!Number.isFinite(usd) || usd <= 0 || usd > 50_000) {
      return NextResponse.json({ error: "Provide ?usd= between 0 and 50000" }, { status: 400 });
    }
    if (!taker || taker.length < 32) {
      return NextResponse.json({ error: "Provide a valid ?taker= address" }, { status: 400 });
    }

    const order = await getFxQuote({
      inputMint: USDC_MINT_MAINNET,
      outputMint: MXNE.mint,
      amount: toNative(usd, USDC_DECIMALS),
      taker,
      // Collect the SolRemit markup on-chain when a fee account is configured.
      ...(FEE_ACCOUNT ? { referralAccount: FEE_ACCOUNT, referralFee: FEE_BPS } : {}),
    });

    if (!order.transaction || !order.requestId) {
      return NextResponse.json(
        { error: "Jupiter did not return a signable transaction" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      transaction: order.transaction,
      requestId: order.requestId,
      summary: {
        inUsdc: usd,
        outLocal: fromNative(order.outAmount, MXNE.decimals),
        destinationSymbol: MXNE.symbol,
        route: describeRoute(order),
        priceImpactPct: order.priceImpactPct,
        slippageBps: order.slippageBps,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Order failed" },
      { status: 502 },
    );
  }
}
