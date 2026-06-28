import { TopBar } from "./components/top-bar";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { FxComparisonPanel } from "./components/fx-comparison-panel";
import { WalletBar } from "./components/wallet-bar";
import { SendFlow } from "./components/send-flow";
import { Faq } from "./components/faq";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg1 text-foreground">
      <main className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-10 border-x border-border-low px-6 pb-16">
        <TopBar />
        <Hero />
        <HowItWorks />
        <WalletBar />
        <FxComparisonPanel />
        <SendFlow />
        <Faq />
      </main>
    </div>
  );
}
