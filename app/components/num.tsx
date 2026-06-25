import type { FormatResult } from "@/lib/format/number";

/**
 * Renders a pre-formatted number with the non-negotiable `font-mono tabular-nums`
 * (prevents jitter on live re-quotes) plus raw value in title/aria for copy +
 * screen readers.
 */
export function Num({
  result,
  className = "",
}: {
  result: FormatResult;
  className?: string;
}) {
  return (
    <span
      className={`font-mono tabular-nums ${className}`}
      aria-label={result.ariaLabel}
      title={result.raw || undefined}
    >
      {result.display}
    </span>
  );
}
