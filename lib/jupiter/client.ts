/**
 * Jupiter REST client. Server-side only — keep the API key off the client.
 *
 * Auth model:
 *   - If JUPITER_API_KEY is set, use the metered host (api.jup.ag) with x-api-key.
 *   - Otherwise fall back to the free, keyless host (lite-api.jup.ag) so the app
 *     runs out of the box in dev. Same paths on both hosts.
 */

const API_KEY = process.env.JUPITER_API_KEY;

export const JUPITER_BASE =
  process.env.JUPITER_API_BASE ??
  (API_KEY ? "https://api.jup.ag" : "https://lite-api.jup.ag");

export class JupiterError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "JupiterError";
  }
}

/** Fetch a Jupiter endpoint with auth + typed error handling. 5s timeout. */
export async function jupiterFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${JUPITER_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        ...init?.headers,
      },
    });

    if (res.status === 429) {
      throw new JupiterError("Rate limited", 429, true);
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new JupiterError(
        body || `HTTP ${res.status}`,
        res.status,
        res.status >= 500,
      );
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof JupiterError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new JupiterError("Request timed out", 408, true);
    }
    throw new JupiterError(
      err instanceof Error ? err.message : "Network error",
      0,
      true,
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** native units (string) -> decimal number. */
export function fromNative(amount: string | number, decimals: number): number {
  return Number(amount) / 10 ** decimals;
}

/** decimal number -> native units (integer string). */
export function toNative(amount: number, decimals: number): string {
  return BigInt(Math.round(amount * 10 ** decimals)).toString();
}
