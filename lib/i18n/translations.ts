/** Bilingual UI strings (EN / ES) for SolRemit's US→Mexico audience. */

export type Lang = "en" | "es";

export const LANGS: Lang[] = ["en", "es"];

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    "nav.tagline": "Transparent remittance · US → Mexico",
    "lang.switchTo": "Español",

    "hero.eyebrow": "SolRemit · US → Mexico",
    "hero.title": "Send money home, see exactly what arrives",
    "hero.subtitle":
      "Stablecoin remittance on Solana with transparent FX routed through Jupiter. We show the mid-market rate, every fee, and the real amount your recipient receives — then compare it to Wise and Western Union.",

    "wallet.off":
      "Wallet & on-ramp are off. Set NEXT_PUBLIC_CDP_PROJECT_ID (and CDP API keys) to enable email sign-in + USD→USDC funding.",
    "wallet.signInToSend": "Sign in to send a transfer.",

    "panel.youSend": "You send",
    "panel.help":
      "Live route via Jupiter. Mid-market rate, every fee, and what your recipient actually receives — nothing hidden.",
    "panel.recipientGets": "Recipient gets",
    "panel.route": "Route",
    "panel.priceImpact": "Price impact",
    "panel.midMarket": "Mid-market",
    "panel.yourRate": "Your rate",
    "panel.spread": "Spread",
    "panel.whereEveryCent": "Where every cent goes",
    "panel.totalCost": "Total cost",
    "panel.loadingError": "Couldn’t fetch a live quote.",
    "panel.tryAgain": "Try again",
    "panel.vs": "vs",
    "panel.getsMore": "Recipient gets {x} more",
    "panel.costsMore": "Costs {x} more",
    "panel.trustVerified": "Verified live against the expected mint before routing.",

    "fee.onRamp": "On-ramp (Coinbase)",
    "fee.fx": "FX (Jupiter vs mid-market)",
    "fee.network": "Solana network",
    "fee.offRamp": "Off-ramp (MXN partner)",
    "fee.platform": "SolRemit fee",

    "how.title": "How it works",
    "how.s1.t": "1 · Sign in with email",
    "how.s1.d": "No seed phrase, no crypto know-how. We create a secure wallet for you.",
    "how.s2.t": "2 · Add funds & set the amount",
    "how.s2.d": "Top up with a card, then see the live rate and every fee before you send.",
    "how.s3.t": "3 · Send to Mexico",
    "how.s3.d": "Pesos reach your recipient through a licensed partner — usually in minutes.",

    "faq.title": "Common questions",
    "faq.q1": "How much does it cost?",
    "faq.a1":
      "Every fee is shown before you send — on-ramp, FX, network, off-ramp, and our flat 0.35% — with the total compared to Wise and Western Union. No hidden spread.",
    "faq.q2": "How fast does the money arrive?",
    "faq.a2":
      "The on-chain transfer settles in seconds. Final delivery to a Mexican bank depends on the local partner, typically minutes.",
    "faq.q3": "Do I need a crypto wallet?",
    "faq.a3":
      "No. Sign in with your email and we create a secure wallet automatically — no seed phrase to manage.",
    "faq.q4": "Is this live?",
    "faq.a4":
      "This is a working demo. The rate comparison is real, live Jupiter data. Sending real money requires connecting a funded wallet and a licensed payout partner.",
  },
  es: {
    "nav.tagline": "Remesas transparentes · EE. UU. → México",
    "lang.switchTo": "English",

    "hero.eyebrow": "SolRemit · EE. UU. → México",
    "hero.title": "Envía dinero a casa y ve exactamente cuánto llega",
    "hero.subtitle":
      "Remesas con stablecoins en Solana y cambio de divisa transparente vía Jupiter. Mostramos el tipo medio de mercado, cada comisión y el monto real que recibe tu destinatario — y lo comparamos con Wise y Western Union.",

    "wallet.off":
      "La billetera y el depósito están desactivados. Configura NEXT_PUBLIC_CDP_PROJECT_ID (y las llaves de CDP) para habilitar el inicio de sesión por correo y el depósito USD→USDC.",
    "wallet.signInToSend": "Inicia sesión para enviar una transferencia.",

    "panel.youSend": "Tú envías",
    "panel.help":
      "Ruta en vivo vía Jupiter. Tipo medio de mercado, cada comisión y lo que realmente recibe tu destinatario — nada oculto.",
    "panel.recipientGets": "El destinatario recibe",
    "panel.route": "Ruta",
    "panel.priceImpact": "Impacto en el precio",
    "panel.midMarket": "Tipo de mercado",
    "panel.yourRate": "Tu tipo",
    "panel.spread": "Diferencial",
    "panel.whereEveryCent": "A dónde va cada centavo",
    "panel.totalCost": "Costo total",
    "panel.loadingError": "No se pudo obtener una cotización en vivo.",
    "panel.tryAgain": "Reintentar",
    "panel.vs": "vs",
    "panel.getsMore": "El destinatario recibe {x} más",
    "panel.costsMore": "Cuesta {x} más",
    "panel.trustVerified":
      "Verificado en vivo contra el mint esperado antes de enrutar.",

    "fee.onRamp": "Depósito (Coinbase)",
    "fee.fx": "Cambio (Jupiter vs mercado)",
    "fee.network": "Red de Solana",
    "fee.offRamp": "Retiro (socio MXN)",
    "fee.platform": "Comisión SolRemit",

    "how.title": "Cómo funciona",
    "how.s1.t": "1 · Inicia sesión con tu correo",
    "how.s1.d":
      "Sin frase semilla ni conocimientos de cripto. Creamos una billetera segura para ti.",
    "how.s2.t": "2 · Agrega fondos y elige el monto",
    "how.s2.d":
      "Recarga con tarjeta y ve el tipo en vivo y cada comisión antes de enviar.",
    "how.s3.t": "3 · Envía a México",
    "how.s3.d":
      "Los pesos llegan a tu destinatario mediante un socio autorizado — normalmente en minutos.",

    "faq.title": "Preguntas frecuentes",
    "faq.q1": "¿Cuánto cuesta?",
    "faq.a1":
      "Cada comisión se muestra antes de enviar — depósito, cambio, red, retiro y nuestro 0.35% fijo — con el total comparado con Wise y Western Union. Sin diferenciales ocultos.",
    "faq.q2": "¿Qué tan rápido llega el dinero?",
    "faq.a2":
      "La transferencia en cadena se liquida en segundos. La entrega final a un banco mexicano depende del socio local, normalmente minutos.",
    "faq.q3": "¿Necesito una billetera cripto?",
    "faq.a3":
      "No. Inicia sesión con tu correo y creamos una billetera segura automáticamente — sin frase semilla que administrar.",
    "faq.q4": "¿Esto está en vivo?",
    "faq.a4":
      "Esta es una demostración funcional. La comparación de tipos usa datos reales y en vivo de Jupiter. Enviar dinero real requiere conectar una billetera con fondos y un socio de pago autorizado.",
  },
};
