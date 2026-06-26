"use client";

import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import type { PropsWithChildren } from "react";
import { CDP_PROJECT_ID, isCdpConfigured } from "@/lib/cdp/config";

/**
 * Wraps the app in CDP's embedded-wallet provider — but only when a project id is
 * configured. Without it, children render untouched so the rest of the app (the FX
 * panel) works with zero CDP setup.
 */
export function CdpProvider({ children }: PropsWithChildren) {
  if (!isCdpConfigured) return <>{children}</>;
  return (
    <CDPHooksProvider config={{ projectId: CDP_PROJECT_ID }}>
      {children}
    </CDPHooksProvider>
  );
}
