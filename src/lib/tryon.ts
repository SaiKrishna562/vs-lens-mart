/* Virtual try-on site switch (Requirements_TryOn.md 3). Off unless the
   environment says TRYON_ENABLED=true. When off, no page shows anything about
   try-on and /media won't serve try-on pictures to the public; staff can still
   prepare frames. Read on the server only. */
export function tryonEnabled(): boolean {
  return process.env.TRYON_ENABLED === "true";
}
