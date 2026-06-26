import { FxComparisonPanel } from "./components/fx-comparison-panel";
import { WalletBar } from "./components/wallet-bar";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg1 text-foreground">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-10 border-x border-border-low px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">
            SolRemit · US → Mexico
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Send money home, see exactly what arrives
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            Stablecoin remittance on Solana with transparent FX routed through
            Jupiter. We show the mid-market rate, every fee, and the real amount
            your recipient receives — then compare it to Wise and Western Union.
          </p>
        </header>

        <WalletBar />

        <FxComparisonPanel />
      </main>
    </div>
  );
}
