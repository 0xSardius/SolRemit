"use client";

import { LangToggle, useLang } from "./lang-provider";

/** Sticky header: brand mark + language toggle. Always interactive (no creds). */
export function TopBar() {
  const { t } = useLang();
  return (
    <div className="sticky top-0 z-20 -mx-6 mb-2 border-b border-border-low bg-bg1/80 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="h-6 w-6 rounded-md"
            style={{ background: "var(--gradient-accent)" }}
            aria-hidden
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold">SolRemit</div>
            <div className="text-[11px] text-muted">{t("nav.tagline")}</div>
          </div>
        </div>
        <LangToggle />
      </div>
    </div>
  );
}
