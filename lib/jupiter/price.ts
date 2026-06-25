/** Mid-market reference pricing via Jupiter Price v3. */

import { jupiterFetch } from "./client";
import type { PriceV3Response } from "./types";

/** USD price per mint. Unreliable tokens come back null (not an error). */
export async function getUsdPrices(mints: string[]): Promise<PriceV3Response> {
  if (mints.length === 0) return {};
  if (mints.length > 50) throw new Error("Price v3 accepts max 50 mints");
  return jupiterFetch<PriceV3Response>(
    `/price/v3?ids=${mints.map(encodeURIComponent).join(",")}`,
  );
}

/**
 * Mid-market FX rate = how many `localMint` units one `usdMint` unit is worth,
 * derived from each token's USD price. For USDC->MXNe this returns ~MXN per USD.
 *
 * Fails closed: throws if either price is missing or non-positive, so we never
 * show a fabricated "mid-market" rate next to a real quote.
 */
export async function getMidMarketRate(
  usdMint: string,
  localMint: string,
): Promise<number> {
  const prices = await getUsdPrices([usdMint, localMint]);
  const usd = prices[usdMint]?.usdPrice;
  const local = prices[localMint]?.usdPrice;
  if (!usd || !local || usd <= 0 || local <= 0) {
    throw new Error("Missing/low-confidence price for mid-market rate");
  }
  return usd / local;
}
