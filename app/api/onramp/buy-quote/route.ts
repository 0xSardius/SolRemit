/**
 * POST /api/onramp/buy-quote
 * Proxies CDP's Create Buy Quote API. Request body is camelCase (per CDP):
 *   { country, paymentAmount, paymentCurrency, paymentMethod, purchaseCurrency,
 *     purchaseNetwork, subdivision?, destinationAddress? }
 * When destinationAddress is set, the response includes a one-click `onrampUrl`.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp/auth";
import { convertSnakeToCamelCase } from "@/lib/cdp/camel";

export const runtime = "nodejs";

const REQUIRED = [
  "country",
  "paymentAmount",
  "paymentCurrency",
  "paymentMethod",
  "purchaseCurrency",
  "purchaseNetwork",
] as const;

export async function POST(request: NextRequest) {
  try {
    getCDPCredentials();
  } catch {
    return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = REQUIRED.filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const apiPath = "/onramp/v1/buy/quote";
  try {
    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });
    const res = await fetch(`${ONRAMP_API_BASE_URL}${apiPath}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: (await res.text()) || "Failed to create buy quote" },
        { status: res.status },
      );
    }
    return NextResponse.json(convertSnakeToCamelCase(await res.json()));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
