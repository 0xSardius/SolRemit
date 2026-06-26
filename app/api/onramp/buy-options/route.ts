/**
 * GET /api/onramp/buy-options?country=US&subdivision=CA&networks=solana
 * Proxies CDP's Onramp Buy Options API (server-side JWT). Returns camelCased data.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp/auth";
import { convertSnakeToCamelCase } from "@/lib/cdp/camel";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const rl = rateLimit(request, "onramp-options", 20);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  try {
    getCDPCredentials();
  } catch {
    return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
  }

  const sp = request.nextUrl.searchParams;
  const query = new URLSearchParams();
  for (const k of ["country", "subdivision", "networks"]) {
    const v = sp.get(k);
    if (v) query.append(k, v);
  }

  const apiPath = "/onramp/v1/buy/options";
  const qs = query.toString();

  try {
    const jwt = await generateCDPJWT({
      requestMethod: "GET",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });
    const res = await fetch(`${ONRAMP_API_BASE_URL}${apiPath}${qs ? `?${qs}` : ""}`, {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: (await res.text()) || "Failed to fetch buy options" },
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
