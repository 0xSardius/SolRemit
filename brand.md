# Brand — SolRemit

**SolRemit** — Wise-style cross-border remittance on Solana (US → Mexico). Send stablecoins
with transparent FX via Jupiter; see the mid-market rate, every fee, and what your recipient
actually receives.

## Palette — Forest Stake
**Mood:** calm · trustworthy · serious · "money that grows."
Grounded forest green — reads safe and dependable, the right register for moving money.
Applied to the project's custom token names in `app/globals.css` (light + dark from the same seeds).

### Seeds (OKLCH)
| Role | Light | Dark |
|---|---|---|
| bg-base (`--background`) | `oklch(0.98 0.01 150)` | `oklch(0.13 0.015 150)` |
| bg-elevated (`--card`) | `oklch(1 0 0)` | `oklch(0.18 0.02 150)` |
| primary (`--accent` → `--color-primary`) | `oklch(0.52 0.15 155)` | `oklch(0.72 0.17 155)` |
| primary-soft / fill (`--cream`) | `oklch(0.96 0.02 150)` | `oklch(0.24 0.03 155)` |
| fg-base (`--foreground`) | `oklch(0.18 0.02 150)` | `oklch(0.96 0.01 150)` |
| muted text (`--muted`) | `oklch(0.45 0.02 150)` | `oklch(0.70 0.02 150)` |
| border-strong / -low | `0.85` / `0.92` | `0.30` / `0.26` (L) |

> Token mapping note: this project uses the create-solana-dapp template's custom token names,
> not stock shadcn. `--color-primary` = `--accent`. All values are AA-contrast verified.

## Typography
- **Sans:** Inter (UI) · **Mono:** Geist Mono (numbers, addresses, rates).
- Wired via `next/font/google` in `app/layout.tsx`. Numbers always `font-mono tabular-nums`.

## Gradients
- `--gradient-accent`: primary → primary-soft (135°). For hero accents / CTAs.
- `--gradient-bg`: subtle top-radial wash of the bg. For section backgrounds.

## Tone & voice
**Trustworthy, plain-spoken, transparent.** We move people's money across a border — the voice
must earn trust on the first read. No hype, no crypto jargon, no exclamation marks.

**Show, don't claim.** Instead of "best rates," show the mid-market rate and the exact landed
amount side-by-side with the incumbents. The numbers are the pitch. When SolRemit costs more than
an alternative, say so — honesty is the differentiator.

**Calm under money.** Copy is short, active, and specific: "Recipient gets MX$3,435," "Send to
Mexico," "Where every cent goes." Reassure at decision points; never rush the user.

## Do / Don't
- **Do** lead with the recipient's landed amount and a clear fee breakdown.
- **Do** use the green primary for the single most important action per screen (Send, Confirm).
- **Do** keep all monetary values mono + tabular; surface trust warnings honestly.
- **Don't** use green for errors/warnings (use the destructive red / amber).
- **Don't** add celebratory or playful flourishes around money movement — stay calm.
- **Don't** hide fees or losses vs competitors; transparency is the brand.

_Applied 2026-06-26. Backup of prior theme at `app/globals.css.bak`. Read by `frontend-design-guidelines` on future component work._
