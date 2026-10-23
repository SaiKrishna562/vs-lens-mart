"use client";

import { useSyncExternalStore } from "react";

/* The current year for the footer. The server sends nothing (it never reads the
   clock while pre-rendering, and a cached page must not show last year); the
   browser fills it in straight after loading, without a hydration mismatch. */
const noop = () => () => {};
export function FooterYear() {
  return useSyncExternalStore(noop, () => String(new Date().getFullYear()), () => "");
}
