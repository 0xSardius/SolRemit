"use client";

import { useLang } from "./lang-provider";

export function Faq() {
  const { t } = useLang();
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];
  return (
    <section className="w-full max-w-xl space-y-3">
      <h2 className="text-lg font-semibold">{t("faq.title")}</h2>
      <div className="divide-y divide-border-low rounded-xl border border-border-low bg-card">
        {items.map((it, i) => (
          <details key={i} className="group p-4 [&_summary]:cursor-pointer">
            <summary className="flex items-center justify-between gap-3 text-sm font-medium list-none focus-visible:ring-2 focus-visible:ring-primary/40">
              {it.q}
              <span className="text-muted transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
