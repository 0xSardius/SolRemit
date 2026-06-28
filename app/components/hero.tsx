"use client";

import { useLang } from "./lang-provider";

export function Hero() {
  const { t } = useLang();
  return (
    <header className="space-y-3">
      <p className="text-sm uppercase tracking-[0.18em] text-muted">{t("hero.eyebrow")}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {t("hero.title")}
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted">{t("hero.subtitle")}</p>
    </header>
  );
}
