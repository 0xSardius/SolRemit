/**
 * Server-side CDP auth. Generates the JWT the Onramp API requires.
 * Verbatim from CDP's verified onramp guide. Keep API secrets server-side only.
 */

import { generateJwt } from "@coinbase/cdp-sdk/auth";

interface CDPAuthConfig {
  requestMethod: string;
  requestHost: string;
  requestPath: string;
}

/** Reads CDP API credentials from env. Throws if unset. */
export function getCDPCredentials() {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;
  if (!apiKeyId || !apiKeySecret) {
    throw new Error("CDP API credentials not configured");
  }
  return { apiKeyId, apiKeySecret };
}

export async function generateCDPJWT(config: CDPAuthConfig): Promise<string> {
  const { apiKeyId, apiKeySecret } = getCDPCredentials();
  return generateJwt({
    apiKeyId,
    apiKeySecret,
    requestMethod: config.requestMethod,
    requestHost: config.requestHost,
    requestPath: config.requestPath,
  });
}

/** Onramp API base. (v1 — session-token endpoints not yet on the v2 platform host.) */
export const ONRAMP_API_BASE_URL = "https://api.developer.coinbase.com";
