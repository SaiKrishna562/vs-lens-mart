"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

/* Signs out, then loads the login page fresh (not a client-side move). A fresh
   load wipes Next.js's in-memory copy of staff pages, so pressing Back after
   signing out can't show the dashboard again (found by tests 2026-10-23). */
export function SignOutButton() {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        window.location.replace("/admin/login");
      }}
      className="inline-flex h-12 items-center rounded-pill border-2 border-btn-ink px-6 font-semibold text-btn-ink disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
