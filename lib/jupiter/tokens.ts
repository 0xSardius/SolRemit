/** Token resolution via Jupiter Tokens v2 — never hardcode unknown mints. */

import { jupiterFetch } from "./client";
import type { JupiterToken } from "./types";

/** Search tokens by symbol, name, or mint (comma-separated mints, max 100). */
export async function searchTokens(query: string): Promise<JupiterToken[]> {
  const res = await jupiterFetch<JupiterToken[]>(
    `/tokens/v2/search?query=${encodeURIComponent(query)}`,
  );
  return Array.isArray(res) ? res : [];
}

export interface TokenTrust {
  /** Safe to route real funds through without a human double-check? */
  ok: boolean;
  warnings: string[];
}

/**
 * A money app must NOT silently pick a lookalike token. The MXN corridor is full
 * of pump.fun impostors named "MXN". Surface every trust concern to the UI.
 */
export function assessTrust(token: JupiterToken): TokenTrust {
  const warnings: string[] = [];
  if (!token.isVerified) warnings.push("not on Jupiter's verified list");
  if ((token.organicScore ?? 0) < 1) warnings.push("low organic-activity score");
  if (token.audit?.mintAuthorityDisabled === false)
    warnings.push("mint authority still enabled (supply can inflate)");
  if (token.audit?.freezeAuthorityDisabled === false)
    warnings.push("freeze authority still enabled (funds can be frozen)");
  if ((token.audit?.topHoldersPercentage ?? 0) > 80)
    warnings.push("highly concentrated holders");
  if (token.usdPrice == null) warnings.push("no reliable price");
  return { ok: warnings.length === 0, warnings };
}

/**
 * Resolve a single expected token. If `expectMint` is supplied, we require the
 * resolved token to match it exactly (defends against symbol spoofing). Returns
 * the token plus its trust assessment, or null if nothing matched.
 */
export async function resolveToken(
  query: string,
  opts: { expectSymbol?: string; expectMint?: string } = {},
): Promise<{ token: JupiterToken; trust: TokenTrust } | null> {
  const results = await searchTokens(query);
  if (results.length === 0) return null;

  let candidates = results;
  if (opts.expectMint) {
    candidates = results.filter((t) => t.id === opts.expectMint);
  } else if (opts.expectSymbol) {
    candidates = results.filter(
      (t) => t.symbol.toLowerCase() === opts.expectSymbol!.toLowerCase(),
    );
  }
  if (candidates.length === 0) return null;

  // Prefer verified, then highest organic score.
  candidates.sort((a, b) => {
    if (!!b.isVerified !== !!a.isVerified) return b.isVerified ? 1 : -1;
    return (b.organicScore ?? 0) - (a.organicScore ?? 0);
  });

  const token = candidates[0];
  return { token, trust: assessTrust(token) };
}
