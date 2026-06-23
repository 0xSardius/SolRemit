# lib/jupiter — Transparent FX routing

**Built with the `integrating-jupiter` skill (build phase).**

Responsibilities:
- Resolve stablecoin mints (USDC, EURC, MXN-pegged) from the Jupiter Token API
  (no hardcoded addresses).
- Fetch a real quote (Ultra/Quote API) for the FX route, exposing:
  - the route (which pools/hops),
  - the effective rate vs the **mid-market** reference rate,
  - **price impact** and all fees,
  - the **total landed cost** the recipient receives.
- This data powers the core differentiator: the side-by-side
  "you save $X vs Wise/Western Union" transparency panel.

Server-side only where an API key is involved; quote display can be client-fetched
from the public endpoint.
