/** Verbatim shapes from the Jupiter REST API (Tokens v2, Price v3, Ultra /order). */

export interface JupiterToken {
  /** Mint address — the primary identity. Symbol/name are convenience only. */
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  isVerified?: boolean;
  organicScore?: number;
  usdPrice?: number;
  audit?: {
    mintAuthorityDisabled?: boolean;
    freezeAuthorityDisabled?: boolean;
    topHoldersPercentage?: number;
  };
}

export interface JupiterRouteHop {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
  bps?: number;
}

export interface JupiterOrder {
  mode?: string;
  /** Native units (before decimals), as strings. */
  inAmount: string;
  outAmount: string;
  otherAmountThreshold?: string;
  swapMode?: string;
  slippageBps: number;
  /** Signed decimal string, e.g. "-0.00355" (negative = favorable). */
  priceImpactPct: string;
  routePlan: JupiterRouteHop[];
  feeBps: number;
  swapType?: string;
  router?: string;
  requestId?: string;
  transaction?: string | null;
  // Error surface (present on failed orders).
  errorCode?: number;
  error?: string;
}

export interface PriceV3Entry {
  usdPrice: number;
  blockId: number;
  decimals: number;
  priceChange24h: number;
}

export type PriceV3Response = Record<string, PriceV3Entry | null>;
