/**
 * Display-only number formatting for SolRemit's money UI.
 *
 * Follows the number-formatting spec's non-negotiables: never scientific
 * notation, never -0.00, null/NaN/Infinity -> "--", copy/aria carry raw
 * precision. Internal math always uses raw values (see lib/fx) — this is purely
 * for what the user sees.
 */

export const PLACEHOLDER = "--";

export interface FormatResult {
  display: string;
  /** Raw decimal string for copy/title. */
  raw: string;
  /** Expanded value for screen readers. */
  ariaLabel: string;
}

type Currency = "USD" | "MXN";
type Context = "compact" | "detailed";
type SignMode = "auto" | "always" | "never";

const CURRENCY_SYMBOL: Record<Currency, string> = { USD: "$", MXN: "MX$" };

function invalid(value: unknown): value is null | undefined {
  return value == null || typeof value !== "number" || !Number.isFinite(value);
}

/** Kill signed/epsilon zero so we never render "-0.00". */
function normalizeZero(value: number): number {
  if (Object.is(value, -0) || Math.abs(value) < Number.EPSILON * 10) return 0;
  return value;
}

const SUFFIXES = [
  { t: 1e12, s: "T" },
  { t: 1e9, s: "B" },
  { t: 1e6, s: "M" },
  { t: 1e3, s: "K" },
];

function applySign(s: string, negative: boolean, sign: SignMode): string {
  if (sign === "never") return s;
  if (negative) return `-${s}`;
  if (sign === "always") return `+${s}`;
  return s;
}

/** Fiat value with currency symbol. 2 decimals; compact abbreviates >= 1K. */
export function formatFiat(
  value: number | null | undefined,
  currency: Currency = "USD",
  context: Context = "detailed",
  sign: SignMode = "auto",
): FormatResult {
  if (invalid(value)) {
    return { display: PLACEHOLDER, raw: "", ariaLabel: "no data" };
  }
  const v = normalizeZero(value);
  const sym = CURRENCY_SYMBOL[currency];
  const abs = Math.abs(v);
  const negative = v < 0;
  const raw = String(v);

  if (v === 0) {
    return { display: `${sym}0.00`, raw: "0", ariaLabel: `${sym}0.00` };
  }
  // Rounds to zero but isn't zero -> tiny marker.
  if (abs < 0.005) {
    const d = applySign(`<${sym}0.01`, negative, "never");
    return { display: d, raw, ariaLabel: `${negative ? "-" : ""}less than ${sym}0.01` };
  }

  if (context === "compact" && abs >= 1000) {
    for (const { t, s } of SUFFIXES) {
      if (abs >= t) {
        const num = (abs / t).toFixed(1).replace(/\.0$/, "");
        const display = applySign(`${sym}${num}${s}`, negative, sign);
        return { display, raw, ariaLabel: display };
      }
    }
  }

  const body = abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const display = applySign(`${sym}${body}`, negative, sign);
  return { display, raw, ariaLabel: display };
}

/** Percent. 2 decimals; tiny marker "<0.01%". */
export function formatPercent(
  value: number | null | undefined,
  sign: SignMode = "auto",
): FormatResult {
  if (invalid(value)) {
    return { display: PLACEHOLDER, raw: "", ariaLabel: "no data" };
  }
  const v = normalizeZero(value);
  const abs = Math.abs(v);
  const negative = v < 0;
  const raw = String(v);

  if (v === 0) return { display: "0.00%", raw: "0", ariaLabel: "0.00%" };
  if (abs < 0.005) {
    const d = `${negative ? "-" : ""}<0.01%`;
    return { display: d, raw, ariaLabel: d };
  }
  const decimals = abs >= 100 ? 1 : 2;
  const display = applySign(`${abs.toFixed(decimals)}%`, negative, sign);
  return { display, raw, ariaLabel: display };
}

/** FX rate (local per USD). Fixed 4 decimals so live updates don't jitter. */
export function formatRate(value: number | null | undefined): FormatResult {
  if (invalid(value)) {
    return { display: PLACEHOLDER, raw: "", ariaLabel: "no data" };
  }
  const v = normalizeZero(value);
  const display = v.toFixed(4);
  return { display, raw: String(v), ariaLabel: display };
}
