"use client";

import { useLang } from "./lang-provider";

export function HowItWorks() {
  const { t } = useLang();
  const steps = [
    { t: t("how.s1.t"), d: t("how.s1.d") },
    { t: t("how.s2.t"), d: t("how.s2.d") },
    { t: t("how.s3.t"), d: t("how.s3.d") },
  ];
  return (
    <section className="w-full max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">{t("how.title")}</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="rounded-xl border border-border-low bg-card p-4">
            <p className="text-sm font-semibold">{s.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
