"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { type Lang, translations } from "@/lib/i18n/translations";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a key; `vars` fills `{name}` placeholders. */
  t: (key: string, vars?: Record<string, string>) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: PropsWithChildren) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore preference + reflect on <html lang>.
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" &&
      localStorage.getItem("solremit-lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("solremit-lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      let s = translations[lang][key] ?? translations.en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
      return s;
    },
    [lang],
  );

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

/** A compact EN/ES toggle button. */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border-low bg-card px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
      aria-label={`Switch language to ${t("lang.switchTo")}`}
    >
      <span aria-hidden>🌐</span>
      {t("lang.switchTo")}
    </button>
  );
}
