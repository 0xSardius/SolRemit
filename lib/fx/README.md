# lib/fx — FX transparency & cost comparison

**Built with `integrating-jupiter` + `number-formatting` (build phase).**

Pure calculation layer (no network) that turns a Jupiter quote + ramp fees into the
numbers the UI shows:
- mid-market rate vs effective rate (the "spread")
- total fees (on-ramp + network + FX + off-ramp)
- total landed amount in MXN
- savings vs a benchmark provider (Wise / Western Union) for the same send amount

This module is the heart of the product's "radical transparency" promise. Keep it
deterministic and unit-tested.
